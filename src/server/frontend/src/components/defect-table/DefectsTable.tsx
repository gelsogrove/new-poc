import React, { useEffect, useRef, useState } from "react"
import DefectModel from "../../models/DefectModel"
import CustomModal from "../customModal/CustomModal"
import "./DefectsTable.css"

interface DefectsTableProps {
  defects: DefectModel[]
}

const DefectsTable: React.FC<DefectsTableProps> = ({ defects }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVin, setSelectedVin] = useState<string | null>(null)
  const [highlightedRowId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const prevDefectsCountRef = useRef<number>(defects.length)

  useEffect(() => {
    if (defects.length > prevDefectsCountRef.current) {
      setLoading(true)
      const loadingTimeoutId = setTimeout(() => setLoading(false), 0)

      return () => {
        clearTimeout(loadingTimeoutId)
      }
    }

    prevDefectsCountRef.current = defects.length
  }, [defects])

  const handleImageClick = (filepath: string) => {
    setSelectedImage(`http://localhost:3000/${filepath}`)
    setSelectedVin(filepath)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setSelectedVin(null) // Clear selectedVin when closing the modal
  }

  const sortedDefects = [...defects].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  return (
    <>
      <div className="defects-table-container">
        <table className="defects-table">
          <thead>
            <tr>
              <th className="detection">DETECTION DEFECTS</th>
              <th className="details">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {sortedDefects.map((defect) => {
              const vin = defect.vin
                ? defect.vin.replace("images/VIN_", "").replace(/\.[^/.]+$/, "")
                : null

              // Determine if this row is loading
              const isLoading = loading && highlightedRowId === defect._msgId

              return (
                <React.Fragment key={defect._msgId}>
                  {isLoading ? (
                    <tr>
                      <td colSpan={2}>
                        <img
                          src="https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif"
                          className="loading"
                          alt="Loading"
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr
                      className={
                        highlightedRowId === defect._msgId
                          ? "highlight-new"
                          : ""
                      }
                    >
                      <td>
                        <>
                          <img
                            src={`http://localhost:3000/${defect.vin}`}
                            alt="Defect"
                            onClick={() => handleImageClick(defect.vin)}
                            className="thumbnail"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://media.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif")
                            }
                          />

                          <img
                            src={`http://localhost:3000/${defect.filepath}`}
                            alt="Defect"
                            onClick={() => handleImageClick(defect.filepath)}
                            className="thumbnail"
                          />
                        </>
                      </td>
                      <td>
                        {vin ? (
                          <>
                            <b>VIN:</b> {vin}
                            <br />
                            <br />
                          </>
                        ) : null}
                        <b>Date:</b>{" "}
                        {new Date(defect.data).toLocaleDateString()}
                        <br />
                        <b>Time:</b>{" "}
                        {new Date(defect.data).toLocaleTimeString()}
                        <br />
                        <b>Defect: </b> Scratch
                        <br />
                        <b>Workshop: </b> T11
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <CustomModal
        isOpen={!!selectedImage}
        onRequestClose={handleCloseModal}
        contentType="image"
        content={selectedImage}
        vin={
          selectedVin
            ? selectedVin.replace("images/VIN_", "").replace(/\.[^/.]+$/, "")
            : ""
        }
      />
    </>
  )
}

export default DefectsTable
