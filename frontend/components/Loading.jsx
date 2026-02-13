import React from 'react'

function Loading() {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-t-indigo-600 border-gray-200 h-16 w-16  "></div>
        </div>
    )
}

export default Loading