import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SeatGrid = ({ rows, cols, occupiedSeats = [], onSeatSelect }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Reset local selection if external occupied seats or grid dimensions change
    useEffect(() => {
        setSelectedSeats([]);
    }, [rows, cols, occupiedSeats]);

    const toggleSeat = (row, col) => {
        const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
        const isSelected = selectedSeats.includes(seatId);

        let newSelection;
        if (isSelected) {
            newSelection = selectedSeats.filter(s => s !== seatId);
        } else {
            newSelection = [...selectedSeats, seatId];
        }

        setSelectedSeats(newSelection);
        onSeatSelect(newSelection);
    };

    const isSeatOccupied = (row, col) => {
        const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
        return occupiedSeats.includes(seatId);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 md:p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md w-full overflow-x-auto custom-scrollbar">
            <div className="w-full min-w-[250px] max-w-[600px] h-2 bg-gradient-to-r from-transparent via-highlight to-transparent rounded-full mb-12 shadow-[0_0_15px_rgba(233,69,96,0.5)]" />
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-8">Screen This Way</p>

            <div className="grid gap-2 md:gap-3 min-w-max pb-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    Array.from({ length: cols }).map((_, colIndex) => {
                        const seatId = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                        const selected = selectedSeats.includes(seatId);
                        const occupied = isSeatOccupied(rowIndex, colIndex);

                        return (
                            <motion.button
                                key={seatId}
                                whileHover={!occupied ? { scale: 1.2 } : {}}
                                whileTap={!occupied ? { scale: 0.9 } : {}}
                                onClick={() => !occupied && toggleSeat(rowIndex, colIndex)}
                                className={`
                                    w-8 h-8 rounded-md text-[10px] font-bold transition-all duration-300
                                    ${occupied ? 'bg-white/10 text-transparent cursor-not-allowed opacity-20' :
                                        selected ? 'bg-highlight text-white shadow-[0_0_10px_rgba(233,69,96,0.5)]' :
                                            'bg-accent/40 text-gray-400 border border-white/5 hover:border-highlight/50'}
                                `}
                            >
                                {seatId}
                            </motion.button>
                        );
                    })
                ))}
            </div>

            <div className="flex gap-8 mt-12 text-xs font-medium text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent/40 rounded border border-white/5" /> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-highlight rounded" /> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/10 rounded opacity-20" /> Occupied
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;
