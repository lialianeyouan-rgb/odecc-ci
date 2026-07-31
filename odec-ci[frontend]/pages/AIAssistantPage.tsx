
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

enum TaskType {
    COMMUNIQUE = "Rédiger un communiqué de presse",
    CORRECTION = "Corriger et améliorer le texte",
    MESSAGE = "Rédiger un message institutionnel"
}

const AIAssistantPage: React.FC = () => {
    const [task, setTask] = useState<TaskType>(TaskType.COMMUNIQUE);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!userInput.trim()) {
            setError("Veuillez entrer une description ou un texte.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const response = await generateText(userInput, task);
            setResult(response);
        } catch (err) {
            setError("Une erreur est survenue lors de la communication avec l'IA. Veuillez réessayer.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <div className="bg-gray-50">
            <header className="bg-odec-blue-900 py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold font-montserrat">Assistant de Rédaction IA</h1>
                    <p className="mt-2 text-lg text-gray-300">Un outil pour vous aider à rédiger vos communications.</p>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="task" className="block text-lg font-medium text-gray-800">1. Choisissez une tâche</label>
                            <select
                                id="task"
                                value={task}
                                onChange={(e) => setTask(e.target.value as TaskType)}
                                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-odec-gold-500 focus:border-odec-gold-500 sm:text-sm rounded-md"
                            >
                                <option value={TaskType.COMMUNIQUE}>Rédiger un communiqué de presse</option>
                                <option value={TaskType.MESSAGE}>Rédiger un message institutionnel</option>
                                <option value={TaskType.CORRECTION}>Corriger et améliorer le texte</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="userInput" className="block text-lg font-medium text-gray-800">
                                {task === TaskType.CORRECTION ? "2. Collez votre texte ici" : "2. Décrivez votre besoin"}
                            </label>
                            <textarea
                                id="userInput"
                                rows={8}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="mt-2 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus:ring-odec-gold-500 focus:border-odec-gold-500"
                                placeholder={
                                    task === TaskType.COMMUNIQUE ? "Ex: Annoncer la tenue d'un séminaire sur le dialogue inter-religieux le 10 juillet à Abidjan. Thème: 'Paix et Cohésion'. Mentionner la participation de 200 leaders..." :
                                    task === TaskType.MESSAGE ? "Ex: Message de vœux pour la nouvelle année aux membres et partenaires. Ton chaleureux et plein d'espoir. Mettre l'accent sur l'unité et les défis à venir." :
                                    "Ex: L'organisation à pour but de defendre les droits..."
                                }
                            />
                        </div>

                        <div>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-odec-blue-800 hover:bg-odec-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-odec-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {isLoading ? 'Génération en cours...' : 'Générer le texte'}
                            </button>
                        </div>
                         {error && <p className="text-red-600 text-center">{error}</p>}
                    </div>

                    {result && (
                        <div className="mt-10 border-t pt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Résultat généré</h3>
                            <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm relative">
                                <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded text-xs">
                                    Copier
                                </button>
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIAssistantPage;
