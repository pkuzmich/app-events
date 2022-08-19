import moment from 'moment';
import { FaImage} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import {useRouter} from "next/router";
import {useState} from "react";
import styles from "@/styles/Form.module.css";
import Link from "next/link";
import Image from "next/image";
import {API_URL} from "@/config/index";

export default function EditEventPage({ evt }) {
	const [values, setValues] = useState({
		name: evt.attributes.name,
		performers: evt.attributes.performers,
		venue: evt.attributes.venue,
		address: evt.attributes.address,
		date: evt.attributes.date,
		time: evt.attributes.time,
		description: evt.attributes.description,
	});
	const [imagePreview, setImagePreview] = useState(
		evt.attributes.image.data
			? evt.attributes.image.data.attributes.formats.thumbnail.url
			: null
	);
	const [showModal, setShowModal] = useState(false);

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
	const handleSubmit = async (e) => {
		e.preventDefault();
		const id = evt.id;

		try {
			// Validation
			const hasEmptyFields = Object.values(values).some((element) => element === '');

			if (hasEmptyFields) {
				toast.error('Please fill in all fields');
			}

			const response = await fetch(`${API_URL}/api/events/${id}`, {
				method: 'PUT',
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
		<Layout title="Edit Event">
			<Link href="/events">
				<a>{'<'} Go Back</a>
			</Link>
			<h1>Edit Event</h1>
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
							value={moment(values.date).format('yyyy-MM-DD')}
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
				<input type="submit" value="Update Event" className="btn" />
			</form>

			<h2>Event Image</h2>
			{imagePreview ? (
				<Image src={imagePreview} height={100} width={170} />
			) : (
				<div>
					<p>No image uploaded</p>
				</div>
			)}

			<div>
				<button onClick={() => setShowModal(true)} className="btn-secondary btn-icon">
					<FaImage /> Set Image
				</button>
			</div>

			<Modal show={showModal} onClose={() => setShowModal(false)}>
				IMAGE UPLOAD
			</Modal>
		</Layout>
	);
}

export async function getServerSideProps({ params: {id} }) {
	const res = await fetch(`${API_URL}/api/events/${id}?populate=image`);
	const evt = await res.json();

	return { props: { evt: evt.data } };
}