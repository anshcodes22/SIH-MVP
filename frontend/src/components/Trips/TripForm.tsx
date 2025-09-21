import React, { useState } from 'react';


type TripFormProps = {
	onSubmit: (tripData: TripFormData) => void;
};

type TripFormData = {
	origin: string;
	destination: string;
	destination_status: 'decided' | 'not_decided' | 'auto_detected';
	purpose: 'work' | 'education' | 'shopping' | 'leisure' | 'other';
	purpose_notes?: string;
	companions_count: number;
	start_time: string; // ISO string
};


const today = () => new Date().toISOString().slice(0, 10);
const now = () => {
	const d = new Date();
	return d.toTimeString().slice(0, 5);
};


export const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [destinationStatus, setDestinationStatus] = useState<'decided' | 'not_decided' | 'auto_detected'>('decided');
	const [purpose, setPurpose] = useState<'work' | 'education' | 'shopping' | 'leisure' | 'other'>('work');
	const [purposeNotes, setPurposeNotes] = useState('');
	const [companions, setCompanions] = useState(0);
	const [date, setDate] = useState(today());
	const [time, setTime] = useState(now());
	const [error, setError] = useState('');

	// Helper to combine date and time into ISO string
	const getStartTime = () => {
		// date: yyyy-mm-dd, time: hh:mm
		const iso = new Date(`${date}T${time}`).toISOString();
		return iso;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!origin.trim()) {
			setError('Origin is required.');
			return;
		}
		setError('');
		onSubmit({
			origin: origin.trim(),
			destination: destination.trim() || 'Not decided yet',
			destination_status: destinationStatus,
			purpose,
			purpose_notes: purposeNotes.trim(),
			companions_count: companions,
			start_time: getStartTime(),
		});
	};

	return (
		<form className="max-w-md mx-auto p-4 bg-white rounded-lg shadow space-y-4" onSubmit={handleSubmit}>
			<h2 className="text-xl font-semibold mb-2">Trip Form</h2>
			{error && <div className="text-red-500 text-sm">{error}</div>}
			<div>
				<label className="block text-sm font-medium mb-1">Origin <span className="text-red-500">*</span></label>
				<input
					type="text"
					className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
					value={origin}
					onChange={e => setOrigin(e.target.value)}
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">Destination</label>
				<input
					type="text"
					className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
					value={destination}
					onChange={e => setDestination(e.target.value)}
					placeholder="Not decided yet"
				/>
			</div>
					<div>
						<label className="block text-sm font-medium mb-1">Destination Status</label>
						<select
							className="w-full border rounded px-3 py-2"
							value={destinationStatus}
							onChange={e => setDestinationStatus(e.target.value as any)}
						>
							<option value="decided">Decided</option>
							<option value="not_decided">Not Decided</option>
							<option value="auto_detected">Auto Detected</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Purpose</label>
						<select
							className="w-full border rounded px-3 py-2"
							value={purpose}
							onChange={e => setPurpose(e.target.value as any)}
						>
							<option value="work">Work</option>
							<option value="education">Education</option>
							<option value="shopping">Shopping</option>
							<option value="leisure">Leisure</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Purpose Notes</label>
						<textarea
							className="w-full border rounded px-3 py-2"
							value={purposeNotes}
							onChange={e => setPurposeNotes(e.target.value)}
							placeholder="Optional notes..."
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Companions</label>
						<input
							type="number"
							min={0}
							className="w-full border rounded px-3 py-2"
							value={companions}
							onChange={e => setCompanions(Number(e.target.value))}
						/>
					</div>
					<div className="flex space-x-2">
						<div className="flex-1">
							<label className="block text-sm font-medium mb-1">Date</label>
							<input
								type="date"
								className="w-full border rounded px-3 py-2"
								value={date}
								onChange={e => setDate(e.target.value)}
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium mb-1">Time</label>
							<input
								type="time"
								className="w-full border rounded px-3 py-2"
								value={time}
								onChange={e => setTime(e.target.value)}
							/>
						</div>
					</div>
			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
			>
				Submit
			</button>
		</form>
	);
};