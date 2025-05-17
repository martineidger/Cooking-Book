// src/components/UserCard.tsx

import { useNavigate } from "react-router-dom";

export const UserCard = ({ user }) => {
    const navigate = useNavigate()
    const clickHandler = (id) => {
        navigate(`/profile/${id}`)
    }

    return (
        <div onClick={() => clickHandler(user.id)} className="user-card">
            <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
                <h3>{user.username || user.email}</h3>
                <p className="user-recipes-count">{user.recipesCount} рецептов</p>
            </div>
        </div>
    );
};



