"use client"

import { FiChevronDown, FiUsers } from "react-icons/fi";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const TeamMembersDropdown = ({ teamMembers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div
                        className="py-1 max-h-96 overflow-y-auto"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-200">
                            <FiUsers className="inline mr-2" />
                            Team Members
                        </div>
                        {teamMembers.map((member) => (
                            <TeamMemberItem key={member.id} member={member} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TeamMemberItem = ({ member }) => (
    <div className="px-4 py-2 hover:bg-gray-100 flex items-center">
        <Image
            src={member.image || "/noavatar.png"}
            alt={member.name || member.email}
            width={32}
            height={32}
            className="rounded-full mr-2"
        />
        <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-700">{member.name}</span>
            <span className="text-xs text-gray-500">{member.email}</span>
        </div>
    </div>
);

export default TeamMembersDropdown;
