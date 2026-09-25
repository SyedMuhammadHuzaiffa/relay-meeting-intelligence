"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="meetings-page" role="alert">
      <h1>Meetings are unavailable</h1>
      <p>We couldn&apos;t load the meeting data. Check the database connection and try again.</p>
      <button onClick={reset} type="button">Try again</button>
    </main>
  );
}
