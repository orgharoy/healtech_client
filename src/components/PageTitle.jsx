import React from 'react'

const PageTitle = ({pageHeader}) => {
  return (
    <div className="border-b pb-4 mb-8">
        <h1 className="font-semibold text-2xl">{pageHeader}</h1>
    </div>
  )
}

export default PageTitle