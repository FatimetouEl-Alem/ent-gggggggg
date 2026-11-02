// Données d’exemple de l’annuaire (entreprises fictives).
// À remplacer par l’API : voir loadBusinesses() dans directory.ts.
export type Sector = "commerce" | "artisanat" | "agriculture" | "numerique" | "services";

export interface Business {
  id: string;
  name: string;
  sector: Sector;
  activity: string;
  city: string;
  description: string;
  /** Mois d’inscription, format AAAA-MM. */
  since: string;
  /** Téléphone public, si l’entreprise a choisi de l’afficher. */
  phone?: string;
}

export const SECTOR_LABELS: Record<Sector, string> = {
  commerce: "Commerce",
  artisanat: "Artisanat",
  agriculture: "Agriculture",
  numerique: "Numérique",
  services: "Services",
};

export const SAMPLE_BUSINESSES: Business[] = [
  { id: "b01", name: "Atelier Nkoum", sector: "artisanat", activity: "Menuiserie", city: "Libreville", since: "2025-11", description: "Meubles sur mesure, portes et charpentes en bois local." },
  { id: "b02", name: "Boulangerie Akanda", sector: "commerce", activity: "Boulangerie", city: "Libreville", since: "2026-02", description: "Pain, viennoiseries et commandes pour les événements." },
  { id: "b03", name: "Ferme Mboumba", sector: "agriculture", activity: "Maraîchage", city: "Franceville", since: "2025-09", description: "Légumes de saison livrés aux marchés et aux restaurants." },
  { id: "b04", name: "Code Estuaire", sector: "numerique", activity: "Développement web", city: "Libreville", since: "2026-01", description: "Sites web et applications mobiles pour les petites entreprises." },
  { id: "b05", name: "Couture Ndong", sector: "artisanat", activity: "Couture et textile", city: "Oyem", since: "2025-12", description: "Tenues en pagne, retouches et uniformes scolaires." },
  { id: "b06", name: "Port-Gentil Pièces Auto", sector: "commerce", activity: "Pièces détachées", city: "Port-Gentil", since: "2025-10", description: "Pièces neuves et d’occasion pour véhicules légers." },
  { id: "b07", name: "Élevage Ogooué", sector: "agriculture", activity: "Aviculture", city: "Port-Gentil", since: "2026-03", description: "Poulets de chair et œufs frais, vente en gros et au détail." },
  { id: "b08", name: "Owendo Logistique", sector: "services", activity: "Transport de marchandises", city: "Owendo", since: "2025-08", description: "Livraison de colis et petits déménagements dans le Grand Libreville." },
  { id: "b09", name: "Cabinet Moussavou", sector: "services", activity: "Comptabilité", city: "Libreville", since: "2026-02", description: "Tenue de comptabilité et déclarations pour les entreprenants." },
  { id: "b10", name: "Savons Bilie", sector: "artisanat", activity: "Cosmétiques naturels", city: "Libreville", since: "2026-04", description: "Savons et huiles à base de produits locaux." },
  { id: "b11", name: "Épicerie du Woleu", sector: "commerce", activity: "Alimentation générale", city: "Oyem", since: "2025-07", description: "Produits de première nécessité, ouverte sept jours sur sept." },
  { id: "b12", name: "Répar’Phone Franceville", sector: "numerique", activity: "Réparation de téléphones", city: "Franceville", since: "2026-01", description: "Écrans, batteries et dépannage logiciel en moins d’une heure." },
  { id: "b13", name: "Manioc Doux", sector: "agriculture", activity: "Agro-transformation", city: "Oyem", since: "2025-11", description: "Bâtons de manioc et farine conditionnés pour la revente." },
  { id: "b14", name: "Studio Lumière", sector: "services", activity: "Photographie", city: "Port-Gentil", since: "2026-03", description: "Reportages de mariage, portraits et photos de produits." },
  { id: "b15", name: "Quincaillerie Owendo", sector: "commerce", activity: "Matériaux de construction", city: "Owendo", since: "2025-06", description: "Ciment, fers, outillage et conseils pour vos chantiers." },
  { id: "b16", name: "DataSav Gabon", sector: "numerique", activity: "Services informatiques", city: "Libreville", since: "2026-04", description: "Installation de réseaux, sauvegardes et maintenance du parc." },
  { id: "b17", name: "Poterie Ekomie", sector: "artisanat", activity: "Céramique", city: "Franceville", since: "2025-10", description: "Pots, jarres et objets de décoration façonnés à la main." },
  { id: "b18", name: "Clean Pro Libreville", sector: "services", activity: "Nettoyage", city: "Libreville", since: "2026-01", description: "Entretien de bureaux et de commerces, contrats mensuels." },
];
