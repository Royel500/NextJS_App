import React from 'react'

export default async function errorhandle({ params }) {
   const p = await params;
   console.log(p);
    return (
    <div>errorhandle</div>
  )
}
