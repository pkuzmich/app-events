import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "@/components/Layout";
import {API_URL} from "@/config/index";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import {FaPencilAlt, FaTimes} from "react-icons/fa";
import Image from "next/image";
import {useRouter} from "next/router";
import {useState} from "react";

export default function EventPage({ evt }) {
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

	const deleteEvent = async (e) => {
		 if (confirm('Are you sure?')) {
			 await fetch(`${API_URL}/api/events/${evt.id}`, {
				 method: 'DELETE',
				 headers,
			 })
				 .then(checkStatus)
				 .then(parseJSON)
				 .then(() => router.push('/events'))
				 .catch(data => toast.error(data.message));
		 }
	};

	return (
		<Layout>
			<div className={styles.event}>
				<div className={styles.controls}>
					<Link href={`/events/edit/${evt.id}`}>
						<a>
							<FaPencilAlt /> Edit Event
						</a>
					</Link>
					<a href="#"
					   className={styles.delete}
					   onClick={deleteEvent}
					>
						<FaTimes /> Delete Event
					</a>
				</div>

				<span>
					{new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
				</span>
				
				<h1>{evt.attributes.name}</h1>
				<ToastContainer />

				{evt.attributes.image.data && (
					<div className={styles.image}>
						<Image
							src={evt.attributes.image.data.attributes.formats.large.url}
							width={960}
							height={600}
							alt={evt.name}
						/>
					</div>
				)}

				<h3>Performers:</h3>
				<p>{evt.attributes.performers}</p>

				<h3>Description:</h3>
				<p>{evt.attributes.description}</p>

				<h3>Venue: {evt.attributes.venue}</h3>
				<p>{evt.attributes.address}</p>

				<Link href="/events">
					<a className={styles.back}>{'<'} Go Back</a>
				</Link>
			</div>
		</Layout>
	);
}

export async function getStaticPaths() {
	const res = await fetch(`${API_URL}/api/events`);
	const events = await res.json();
	const data = events.data;

	const paths = data.map(evt => ({
		params: {slug: evt.attributes.slug}
	}));

	return {
		paths,
		fallback: true,
	}
}

export async function getStaticProps({ params: { slug } }) {
	const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=image`);
	const events = await res.json();

	return {
		props: {
			evt: events.data[0],
		},
		revalidate: 1,
	}
}