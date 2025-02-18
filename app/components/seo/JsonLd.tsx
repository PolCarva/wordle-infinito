export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Wordle Infinito",
    "description": "Juega múltiples partidas de Wordle simultáneamente. Un desafío de palabras donde puedes resolver varios puzzles a la vez.",
    "url": "https://wordleinfinito.com",
    "applicationCategory": "GameApplication",
    "genre": "Juego de palabras",
    "browserRequirements": "Requiere un navegador web moderno",
    "creator": {
      "@type": "Person",
      "name": "Pablo Carvalho"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "inLanguage": "es",
    "operatingSystem": "All",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "Múltiples tableros simultáneos",
      "Sistema de vidas",
      "Modo de palabras raras",
      "Partidas personalizadas",
      "Interfaz adaptable"
    ],
    "screenshot": {
      "@type": "ImageObject",
      "url": "https://wordleinfinito.com/opengraph-image"
    },
    "softwareHelp": {
      "@type": "CreativeWork",
      "text": "Adivina múltiples palabras de 5 letras usando pistas de colores: verde para letras correctas, amarillo para letras en posición incorrecta."
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 