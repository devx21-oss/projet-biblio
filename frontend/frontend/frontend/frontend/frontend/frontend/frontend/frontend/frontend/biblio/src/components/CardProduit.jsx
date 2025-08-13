export default function CardProduit({ produit }) {
  return (
    <div className="border rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <img
        src={produit.image || '/placeholder.jpg'}
        alt={produit.nom}
        className="w-full h-40 object-cover mb-3 rounded"
      />
      <h3 className="font-bold text-lg truncate">{produit.titre}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{produit.description}</p>
      <p className="text-green-600 font-semibold mt-2">{produit.auteur} €</p>
    </div>
  );
}
