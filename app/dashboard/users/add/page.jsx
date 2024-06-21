import { addMember } from "@/lib/action";


import React from 'react'

const AddMemberPage = () => {
  return (
    <div className="p-5 rounded-xl mt-5">
        <form action={addMember} className="flex flex-wrap justify-between">
            <input type="text" placeholder="Full Name" name="fullName" required/>
            <input type="email" placeholder="email" name="email" required/>
            <input type="password" placeholder="password" name="password" required/>
            <label htmlFor="role">Select the role</label>
            <select name="role" required>
                <option value="Co-Host">Co-Host</option>
                <option value="Maid">Maid</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Driver">Driver</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default AddMemberPage