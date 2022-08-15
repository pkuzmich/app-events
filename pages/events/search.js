import Layout from "@/components/Layout";
import {API_URL} from "@/config/index";
import EventItem from "@/components/EventItem";
import {useRouter} from "next/router";
import Link from "next/link";
import styles from "@/styles/Event.module.css";
const qs = require('qs');

export default function SearchPage({ events }) {
	const router = useRouter();

	return (
		<Layout title="Search Results">
			<Link href="/events">
				<a className={styles.back}>{'<'} Go Back</a>
			</Link>
			<h1>Search Results for &quot;{router.query.term}&quot;</h1>
			{events.length === 0 && <h3>No events to show</h3>}

			{events.map(evt => (
				<EventItem key={evt.id} evt={evt.attributes} />
			))}
		</Layout>
	);
}

export async function getServerSideProps({ query: {term} }) {
	const query = qs.stringify({
		filters: {
			$or: [
				{name: { $contains: term }},
				{performers: { $contains: term }},
				{description: { $contains: term }},
				{venue: { $contains: term }},
			],
		},
	});

	const res = await fetch(`${API_URL}/api/events?populate=image&${query}`);
	const events = await res.json();

	return {
		props: { events: events.data }
	}
}