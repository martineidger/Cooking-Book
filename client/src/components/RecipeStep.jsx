import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeStep = () => {
    const { id, stepNumber } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStep = async () => {
            try {
                const response = await axios.get(`/api/recipes/${id}/steps/${stepNumber}`);
                setStep(response.data);
            } catch (error) {
                console.error('Error fetching step:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStep();
    }, [id, stepNumber]);

    if (loading) return <div>Loading step...</div>;
    if (!step) return <div>Step not found</div>;

    return (
        <div className="step-detail">
            <button onClick={() => navigate(-1)}>← Назад к рецепту</button>
            <h2>Шаг {step.order}: {step.title}</h2>
            <p>Время: {step.durationMin} минут</p>
            <div className="step-content">
                <p>{step.description}</p>
                {step.image && <img src={step.image} alt={`Шаг ${step.order}`} />}
            </div>
        </div>
    );
};