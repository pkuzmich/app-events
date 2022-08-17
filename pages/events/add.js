import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useState} from "react";
import styles from "@/styles/Form.module.css";
import Link from "next/link";
import {API_URL} from "@/config/index";

export default function AddEventPage() {
	const [values, setValues] = useState({
		name: "",
		performers: "",
		venue: "",
		address: "",
		date: "",
		time: "",
		description: "",
	});

	const [errorEvents, setErrorEvents] = useState(null);

	const router = useRouter();

	// Parses the JSON returned by a network request
	const parseJSON = resp => (resp.json ? resp.json() : resp);

	// Checks if a network request came back fine, and throws an error if not
	const checkStatus = resp => {
		if (resp.status >= 200 && resp.status < 300) {
			return resp;
		}
		return parseJSON(resp).then(resp => {
			throw resp;
		});
	};

	const headers = {
		'Content-Type': 'application/json',
	};

	// https://docs.strapi.io/developer-docs/latest/developer-resources/content-api/integrations/next-js.html#post-request-your-collection-type
	const handleSubmit = async e => {
		e.preventDefault();


		try {
			// Validation
			const hasEmptyFields = Object.values(values).some((element) => element === '');

			if (hasEmptyFields) {
				toast.error('Please fill in all fields');
			}

			const response = await fetch(`${API_URL}/api/events`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ data: values }),
			})
				.then(checkStatus);

			const evt = await response.json();
			const slug = evt.data.attributes.slug;

			await router.push(`/events/${slug}`);
		} catch (error) {
			toast.error('Something Went Wrong');
			setErrorEvents(error);
		}
	};

	const handleInputChange = ({ target: { name, value } }) => {
		setValues(prev => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Layout title="Add New Event">
			<Link href="/events">
				<a>{'<'} Go Back</a>
			</Link>
			<h1>Add Event</h1>
			<ToastContainer />

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.grid}>
					<div>
						<label htmlFor="name">Event Name:</label>
						<input
							type="text"
							id="name"
							name="name"
							value={values.name}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="performers">Performers:</label>
						<input
							type="text"
							id="performers"
							name="performers"
							value={values.performers}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="venue">Venue:</label>
						<input
							type="text"
							id="venue"
							name="venue"
							value={values.venue}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="address">Address:</label>
						<input
							type="text"
							id="address"
							name="address"
							value={values.address}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="date">Date:</label>
						<input
							type="date"
							id="date"
							name="date"
							value={values.date}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="time">Time:</label>
						<input
							type="text"
							id="time"
							name="time"
							value={values.time}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div>
					<label htmlFor="description">Description:</label>
					<textarea
						id="description"
						name="description"
						value={values.description}
						onChange={handleInputChange}
					/>
				</div>
				<input type="submit" value="Add Event" className="btn" />
			</form>
		</Layout>
	);
}