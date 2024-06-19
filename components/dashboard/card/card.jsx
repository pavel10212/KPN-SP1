import React from 'react'

const Card = ({ item}) => {
  return (
    <div className='bg-white p-5 rounded-xl flex gap-5 cursor-pointer w-full hover:bg-slate-700'>
      <div className='flex flex-col gap-5'>
        <span className='font-semibold text-[#202224]'>{item.title}</span>
        <span className='font-bold text-2xl text-[#202224]'>{item.number}</span>
      </div>
    </div>
  )
}

export default Card