import os
import cv2
import numpy as np
import base64
from ultralytics import YOLO
import easyocr
from concurrent.futures import ThreadPoolExecutor
import time

def resize_image(image, target_size=(640, 640)):
    """Resize the input image to the target size."""
    return cv2.resize(image, target_size)

def draw_bounding_box(image, bbox, margin=10, color=(255, 0, 255), thickness=2):
    """Draw a bounding box on the image."""
    x1, y1, x2, y2 = bbox
    x1 = max(0, x1 - margin)
    y1 = max(0, y1 - margin)
    x2 = min(image.shape[1], x2 + margin)
    y2 = min(image.shape[0], y2 + margin)
    cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness)
    return image

def zoom_into_bbox(image, bbox, margin=10, zoom_level=3.0):
    """Zoom into the bounding box area with an optional margin and zoom level."""
    x1, y1, x2, y2 = bbox
    x1 = max(0, x1 - margin)
    y1 = max(0, y1 - margin)
    x2 = min(image.shape[1], x2 + margin)
    y2 = min(image.shape[0], y2 + margin)
    
    cropped_img = image[y1:y2, x1:x2]
    
    zoom_width = int(cropped_img.shape[1] * zoom_level)
    zoom_height = int(cropped_img.shape[0] * zoom_level)
    
    zoomed_img = cv2.resize(cropped_img, (zoom_width, zoom_height))
    
    return zoomed_img

def convert_image_to_base64(image):
    """Convert image to a Base64 encoded string."""
    _, buffer = cv2.imencode('.jpg', image)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return base64_str

def perform_ocr(image_base64, ocr_confidence_threshold=0.7):
    """Perform OCR on the given Base64 image and return the extracted text."""
    model_storage_directory = 'easyocr/models'
    reader = easyocr.Reader(['en'], download_enabled=False, model_storage_directory=model_storage_directory)
    
    try:
        # Decode Base64 string to image
        image_data = base64.b64decode(image_base64)
        image_np = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
    
        results = reader.readtext(image)
    
        vin_number = None
        detected_texts = []
    
        for (bbox, text, prob) in results:
            if prob > ocr_confidence_threshold:
                detected_texts.append(text.strip())
    
        vin_number = ''.join(detected_texts).replace('.', '').replace(',', '')
        print("vin_number:", vin_number)
    
        return vin_number
    except Exception as e:
        print(f"Error performing OCR: {e}")
        return ""

def process_image(filepath, model, confidence_threshold, ocr_confidence_threshold, margin, target_size, output_dir, delete_original):
    """Process a single image: detect, zoom, and OCR."""
    try:
        start_time = time.time()  # Start time for profiling
        frame = cv2.imread(filepath)
        if frame is None:
            print(f"Failed to read image {filepath}.")
            return

        resized_frame = resize_image(frame, target_size)
        results = model(resized_frame, verbose=False)
        boxes = results[0].boxes.xyxy.tolist()
        confidences = results[0].boxes.conf.tolist()

        print("boxes:", boxes)

        if not boxes:
            print(f"No boxes detected in {filepath}.")
            return

        for box, conf in zip(boxes, confidences):
            if conf > confidence_threshold:
                x1, y1, x2, y2 = map(int, box)
                resized_frame_with_bbox = draw_bounding_box(resized_frame.copy(), (x1, y1, x2, y2), margin)
                
                zoom_start = time.time()
                zoomed_img = zoom_into_bbox(resized_frame, (x1, y1, x2, y2), margin, zoom_level=4.0)
                zoom_end = time.time()
                # print(f"Zoom time: {zoom_end - zoom_start:.2f} seconds")

                base64_start = time.time()
                zoomed_image_base64 = convert_image_to_base64(zoomed_img)
                base64_end = time.time()
                # print(f"Base64 conversion time: {base64_end - base64_start:.2f} seconds")

                ocr_start = time.time()
                vin_number = perform_ocr(zoomed_image_base64, ocr_confidence_threshold)
                ocr_end = time.time()
                print(f"OCR time: {ocr_end - ocr_start:.2f} seconds")

                if vin_number:
                    new_filename = f"VIN_{vin_number}{os.path.splitext(filepath)[1]}"
                    new_filepath = os.path.join(output_dir, new_filename)
                    cv2.imwrite(new_filepath, resized_frame_with_bbox)
                    
                if delete_original:
                    os.remove(filepath)

                break
    except Exception as e:
        print(f"Error processing image {filepath}: {e}")

def run_yolo_detection(model_path, input_dir, output_dir, confidence_threshold=0.7, ocr_confidence_threshold=0.7, margin=10, target_size=(640, 640), delete_original=False):
    """Run YOLO detection, zoom, and OCR on images in the input directory."""
    os.makedirs(output_dir, exist_ok=True)
    model = YOLO(model_path, task="detect", verbose=False)

    files = [os.path.join(input_dir, f) for f in os.listdir(input_dir) if 'vin' in f.lower() and f.endswith((".jpg", ".jpeg", ".png"))]

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(process_image, filepath, model, confidence_threshold, ocr_confidence_threshold, margin, target_size, output_dir, delete_original) for filepath in files]
        for future in futures:
            try:
                future.result()  # To catch exceptions raised in the thread
            except Exception as e:
                print(f"Error in thread: {e}")

model_path = "models/vin.onnx"
input_dir = "defects/scratches"
output_dir = "output"
confidence_threshold = 0.7
ocr_confidence_threshold = 0.1
margin = 10
delete_original = True

run_yolo_detection(model_path, input_dir, output_dir, confidence_threshold, ocr_confidence_threshold, margin, delete_original=delete_original)
