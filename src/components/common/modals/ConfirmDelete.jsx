import React from 'react'
import { X } from "lucide-react"
import ButtonWithIcon from '../buttons/ButtonWithIcon'

const ConfirmDelete = ({ stuffName, onClose, onDelete , id}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 cursor-default">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[580px] max-h-[97%] p-10 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto ">
                <div className="flex flex-col">


                    <span className='p-2 rounded-full hover:bg-gray-200 w-fit cursor-pointer absolute right-2 top-2'><X size={20} /></span>

                    <h4 className='text-xl font-bold pb-4'>Confirm to Delete</h4>
                    <hr />

                    <h5 className='pt-4'>Are you sure you want to delete this {stuffName}?</h5>

                    <div className='flex justify-end items-center gap-5 pt-8'>
                        <ButtonWithIcon text="No, Cancel" onClick={onClose} />
                        <ButtonWithIcon text="Yes, Delete" bgColor="bg-red-600" borderColor="border-red-800"
                            hoverColor="hover:bg-red-700"
                            onClick={()=>onDelete(id)} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ConfirmDelete
