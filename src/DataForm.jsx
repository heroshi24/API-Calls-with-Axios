import React, { useEffect, useState } from "react";
import axios from 'axios';

function RecipeForm() {
    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        axios
            .get('https://jornadaldb.netlify.app/.netlify/functions/api/')
            .then((response) => {
                setRecipes(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('Failed to fetch recipes');
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !cuisine || !ingredients) {
            setError('Name, cuisine, and ingredients are required');
            return;
        }
    
        const url = editItem
            ? `https://jornadaldb.netlify.app/.netlify/functions/api/${editItem._id}`
            : 'https://jornadaldb.netlify.app/.netlify/functions/api/';
        const method = editItem ? 'put' : 'post';
    
        const recipeData = { name, cuisine, ingredients, favorite };
    
        axios[method](url, recipeData)
            .then((response) => {
                console.log(response.data);
    
                if (editItem) {
                    // If editing, update the edited recipe in the state
                    setRecipes((prevRecipes) =>
                        prevRecipes.map((recipe) =>
                            recipe._id === editItem._id ? response.data : recipe
                        )
                    );
                } else {
                   
                    setRecipes((prevRecipes) => [...prevRecipes, response.data]);
                }
                // Reset form fields and error message
                setName('');
                setCuisine('');
                setIngredients('');
                setFavorite(false);
                setEditItem(null);
                setError(null);
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('There was an error submitting the data');
            });
    };
    

    const handleEdit = (_id) => {
        const recipeToEdit = recipes.find((recipe) => recipe._id === _id);
        setEditItem(recipeToEdit);
        setName(recipeToEdit.name);
        setCuisine(recipeToEdit.cuisine);
        setIngredients(recipeToEdit.ingredients);
        setFavorite(recipeToEdit.favorite);
    };

    const handleDelete = (_id) => {
        axios
            .delete(`https://jornadaldb.netlify.app/.netlify/functions/api/${_id}`)
            .then(() => {
                setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== _id));
            })
            .catch((error) => {
                console.error('There was an error!', error);
                setError('There was an error deleting the recipe');
            });
    };

    return (
            <div className="recipe-form-container">
        <style>{`
            .recipe-form-container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            form {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }
            input, textarea {
                padding: 12px;
                border: 1px solid #d0d0d0;
                border-radius: 4px;
                font-size: 16px;
                transition: border-color 0.2s;
            }
            input:focus, textarea:focus {
                border-color: #007bff;
                outline: none;
            }
            button {
                padding: 12px;
                border: none;
                border-radius: 4px;
                background-color: #007bff;
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            button:hover {
                background-color: #0056b3;
            }
            ul {
                list-style: none;
                padding: 0;
            }
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
                transition: background-color 0.2s;
            }
            li:hover {
                background-color: #f9f9f9;
            }
            .button-group {
                display: flex;
                gap: 8px;
            }
            .edit-button {
                background-color: #28a745;
            }
            .edit-button:hover {
                background-color: #218838;
            }
            .delete-button {
                background-color: #dc3545;
            }
            .delete-button:hover {
                background-color: #c82333;
            }
            p {
                color: #dc3545;
                font-size: 14px;
                margin-top: -10px;
                margin-bottom: 20px;
            }
        `}</style>
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Recipe Name'
            />
            <input
                type='text'
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder='Cuisine'
            />
            <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder='Ingredients (comma separated)'
            />
            <label>
                <input
                    type='checkbox'
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                />
                Favorite
            </label>
            <button type='submit'>{editItem ? 'Update Recipe' : 'Add Recipe'}</button>
        </form>
        {error && <p>{error}</p>}
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe._id}>
                    {recipe.name} - {recipe.cuisine}
                    <div className="button-group">
                        <button className="edit-button" onClick={() => handleEdit(recipe._id)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>


    );
}

export default RecipeForm;
