export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Bibliothèque Numérique. Tous droits réservés.</p>
      <p className="mt-2">
        Photo by{' '}
        <a
          href="https://unsplash.com/@jeztimms?utm_source=unsplash"
          className="underline hover:text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          Jez Timms
        </a>{' '}
        on{' '}
        <a
          href="https://unsplash.com/photos/building-interior-vTKLujPJecw?utm_source=unsplash"
          className="underline hover:text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </a>
      </p>
    </footer>
  );
}
