"use client"

import type React from "react"
import { useState } from "react"

interface TailorEntry {
  name: string
  description: string
}

interface AddTailorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (tailorInfoList: TailorEntry[]) => void
  orderId: string
}

export default function AddTailorModal({ isOpen, onClose, onSubmit, orderId }: AddTailorProps) {
  const [tailorList, setTailorList] = useState<TailorEntry[]>([{ name: "", description: "" }])

  if (!isOpen) return null

  const handleChange = (index: number, field: keyof TailorEntry, value: string) => {
    const updatedList = [...tailorList]
    updatedList[index][field] = value
    setTailorList(updatedList)
  }

  const handleAdd = () => {
    setTailorList([...tailorList, { name: "", description: "" }])
  }

  const handleRemove = (index: number) => {
    const updatedList = [...tailorList]
    updatedList.splice(index, 1)
    setTailorList(updatedList)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty entries
    const validTailors = tailorList.filter((tailor) => tailor.name.trim() !== "" && tailor.description.trim() !== "")

    if (validTailors.length === 0) {
      alert("Please enter at least one tailor with name and description")
      return
    }

    onSubmit(validTailors)
    setTailorList([{ name: "", description: "" }]) // Reset after submit
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6">Enter Tailor Information</h2>
        <form onSubmit={handleSubmit}>
          {tailorList.map((entry, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <label className="block text-sm font-medium mb-2">Tailor Name</label>
              <input
                type="text"
                value={entry.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />

              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={entry.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                placeholder="Enter design or other details"
              />

              {tailorList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="mt-2 text-red-500 text-sm underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={handleAdd} className="mb-6 text-sm text-blue-600 underline">
            + Add another
          </button>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
