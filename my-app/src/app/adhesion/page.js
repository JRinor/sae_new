'use client';

import React, { useState } from "react";
import Header from '@/components/Header';

const Adhesion = () => {
  const initialFormData = {
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    telephone: "",
    email: "",
    cotisation: "",
    legumes: "",
    frequenceLegumes: "",
    formuleLegumes: "",
    oeufs: "",
    frequenceOeufs: "",
    formuleOeufs: "",
    fruits: "",
    frequenceFruits: "",
    formuleFruits: "",
    depotLivraison: "",
    adresseDepot: "",
    dateDebut: "",
    jourLivraison: "",
  };

  const steps = [
    {
      title: "Informations personnelles",
      fields: ["nom", "prenom", "adresse", "codePostal", "ville", "telephone", "email"],
    },
    { title: "Cotisation", fields: ["cotisation"] },
    {
      title: "Paniers de légumes",
      fields: ["legumes", "frequenceLegumes", "formuleLegumes"],
    },
    {
      title: "Boîtes d'œufs",
      fields: ["oeufs", "frequenceOeufs", "formuleOeufs"],
    },
    {
      title: "Paniers de fruits",
      fields: ["fruits", "frequenceFruits", "formuleFruits"],
    },
    {
      title: "Point de retrait",
      fields: ["depotLivraison", "adresseDepot"],
    },
    {
      title: "Dates de livraison",
      fields: ["dateDebut", "jourLivraison"],
    },
    {
      title: "Récapitulatif",
      fields: [],
    },
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep = () => {
    const stepFields = steps[currentStep].fields;
    let tempErrors = {};

    stepFields.forEach((field) => {
      if (!formData[field]) {
        tempErrors[field] = "Ce champ est requis.";
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      alert("Formulaire soumis avec succès !");
    }
  };

  const depots = [
    { id: 1, nom: "Dépôt Centre-ville", adresse: "123 rue de la République" },
    { id: 2, nom: "Dépôt Gare", adresse: "45 avenue de la Gare" },
    { id: 3, nom: "Dépôt Sud", adresse: "78 boulevard du Sud" },
  ];

  const joursLivraison = ["Lundi", "Mercredi", "Vendredi"];

  const renderDepotSelection = () => (
    <div className="grid grid-cols-1 gap-4">
      {depots.map((depot) => (
        <label key={depot.id} className="block p-4 border rounded-lg hover:border-green-500 cursor-pointer">
          <input
            type="radio"
            name="depotLivraison"
            value={depot.id}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="font-semibold">{depot.nom}</span>
          <p className="text-gray-600 ml-6">{depot.adresse}</p>
        </label>
      ))}
    </div>
  );

  const renderRecapitulatif = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Récapitulatif de votre abonnement</h3>
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Formule choisie:</span>
          <span>{formData.formuleLegumes || "Aucune"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Point de retrait:</span>
          <span>{depots.find(d => d.id === parseInt(formData.depotLivraison))?.nom || "Non sélectionné"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Jour de livraison:</span>
          <span>{formData.jourLivraison || "Non sélectionné"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F3EC] min-h-screen py-8 font-open-sans relative">
      <Header />
      <div className="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-green-700 z-10 mt-10">
        <div className="text-center mb-6">
          <img
            src="/img/cocagne-vert.png"
            alt="Les Jardins de Cocagne"
            className="mx-auto mb-4 w-20 h-20 object-contain"
          />
          <h1 className="text-3xl font-bold text-green-700">
            FORMULAIRE ABONNEMENT 2025
          </h1>
        </div>

        <div className="mb-8">
          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div
              className="absolute top-0 left-0 h-4 bg-green-700 rounded-full"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-center mt-2 text-green-700 font-bold">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            {steps[currentStep].title}
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {steps[currentStep].fields.map((field) => (
              <div key={field}>
                {field === "cotisation" && (
                  <>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      Choisissez votre cotisation :
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="cotisation"
                          value="5"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Cotisation de 5 €
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="cotisation"
                          value="10"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Cotisation de 10 €
                      </label>
                    </div>
                  </>
                )}

                {field === "legumes" && (
                  <>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      Souhaitez-vous recevoir des paniers de légumes ?
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="legumes"
                          value="oui"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Oui
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="legumes"
                          value="non"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Non
                      </label>
                    </div>
                    {formData.legumes === "oui" && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-green-700 mb-2">
                          Fréquence :
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceLegumes"
                              value="hebdomadaire"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Hebdomadaire
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceLegumes"
                              value="bimensuelle"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Bimensuelle
                          </label>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-green-700 mb-2">
                            Formule :
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleLegumes"
                                value="panier simple"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              Panier simple
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleLegumes"
                                value="panier familial"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              Panier familial
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {field === "oeufs" && (
                  <>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      Souhaitez-vous recevoir des boîtes d'œufs ?
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="oeufs"
                          value="oui"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Oui
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="oeufs"
                          value="non"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Non
                      </label>
                    </div>
                    {formData.oeufs === "oui" && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-green-700 mb-2">
                          Fréquence :
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceOeufs"
                              value="hebdomadaire"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Hebdomadaire
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceOeufs"
                              value="bimensuelle"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Bimensuelle
                          </label>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-green-700 mb-2">
                            Formule :
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleOeufs"
                                value="1 boîte de 6 œufs"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              1 boîte de 6 œufs
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleOeufs"
                                value="2 boîtes de 6 œufs"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              2 boîtes de 6 œufs
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleOeufs"
                                value="3 boîtes de 6 œufs"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              3 boîtes de 6 œufs
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {field === "fruits" && (
                  <>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      Souhaitez-vous recevoir des paniers de fruits ?
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="fruits"
                          value="oui"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Oui
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="fruits"
                          value="non"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Non
                      </label>
                    </div>
                    {formData.fruits === "oui" && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-green-700 mb-2">
                          Fréquence :
                        </label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceFruits"
                              value="hebdomadaire"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Hebdomadaire
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="frequenceFruits"
                              value="bimensuelle"
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Bimensuelle
                          </label>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-green-700 mb-2">
                            Formule :
                          </label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleFruits"
                                value="panier simple"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              Fruité 1
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="formuleFruits"
                                value="panier familial"
                                onChange={handleChange}
                                className="mr-2"
                              />
                              Fruité 2
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {field === "livraison" && (
                  <>
                    <label className="block text-sm font-semibold text-green-700 mb-2">
                      Je souhaite être livré :
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="livraison"
                          value="depot"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        En dépôt
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="livraison"
                          value="domicile"
                          onChange={handleChange}
                          className="mr-2"
                        />
                        À domicile
                      </label>
                    </div>
                  </>
                )}

                {field !== "cotisation" &&
                  field !== "legumes" &&
                  field !== "oeufs" &&
                  field !== "fruits" &&
                  !["frequenceLegumes", "frequenceOeufs", "formuleLegumes", "formuleOeufs", "frequenceFruits", "formuleFruits"].includes(field) && (
                    <div>
                      <label
                        className="block text-sm font-semibold text-green-700 mb-2 capitalize"
                        htmlFor={field}
                      >
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            ))}
            {currentStep === 5 && renderDepotSelection()}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">
                    Date de début souhaitée
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">
                    Jour de livraison préféré
                  </label>
                  <select
                    name="jourLivraison"
                    value={formData.jourLivraison}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="">Sélectionnez un jour</option>
                    {joursLivraison.map((jour) => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {currentStep === 7 && renderRecapitulatif()}
          </div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Précédent
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Soumettre
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adhesion;
