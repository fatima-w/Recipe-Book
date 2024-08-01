from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, current_app
from .models import Data, User, Group, Ingredient,Review, Comment
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
import os
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy import func

from flask import abort

views = Blueprint('views', __name__)
CORS(views)
# @views.route('/')
# @jwt_required()
# def home():
#     current_user = User.query.get(get_jwt_identity())
#     public_groups = Group.query.filter_by(public=True).all()
#     user_groups = Group.query.filter((Group.user_id == current_user.id) | (Group.public == True)).all()
#     unique_groups = {group.id: group for group in user_groups}.values()
#     public_recipes = Data.query.join(Group).filter(Group.public == True).all()

#     return render_template("home.html", user=current_user, groups=unique_groups, public_recipes=public_recipes)
@views.route('/')
@jwt_required()
def home():
    current_user = User.query.get(get_jwt_identity())
   
    public_groups = Group.query.filter_by(public=True).all()
    public_recipes = Data.query.join(Group).filter(Group.public == True).all()

    groups_list = [{'id': group.id, 'name': group.name, 'description': group.description} for group in public_groups]
    recipes_list = [{'id': recipe.id, 'recipe': recipe.recipe, 'image_path': recipe.image_path, 'instructions': recipe.instructions, 'group_id': recipe.group_id} for recipe in public_recipes]
    return jsonify({'user': current_user.id, 'public_groups': groups_list, 'public_recipes': recipes_list})



# @views.route('/group/<int:group_id>')
# @jwt_required()
# def group_recipes(group_id):
    # current_user = User.query.get(get_jwt_identity())
    # group = Group.query.get_or_404(group_id)
    # if not group.public and group.user_id != current_user.id:
    #     return jsonify({'error': 'You do not have permission to view this group!'}), 403

    # recipes = Data.query.filter_by(group_id=group_id).all()
    # recipes_list = [{'id': recipe.id, 'recipe': recipe.recipe, 'image_path': recipe.image_path, 'instructions': recipe.instructions} for recipe in recipes]

# @views.route('/group/<int:group_id>')
# @jwt_required()
# def group_recipes(group_id):
#     current_user = User.query.get(get_jwt_identity())
#     group = Group.query.get_or_404(group_id)
#     if not group.public and group.user_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to view this group!'}), 403

#     recipes = Data.query.filter_by(group_id=group_id).all()
#     recipes_list = [{'id': recipe.id, 'recipe': recipe.recipe, 'image_path': recipe.image_path, 'instructions': recipe.instructions} for recipe in recipes]

#     return jsonify({'recipes': recipes_list}), 200

@views.route('/group/<int:group_id>')
@jwt_required()
def group_recipes(group_id):
    current_user = User.query.get(get_jwt_identity())
    group = Group.query.get_or_404(group_id)
    isUserAllowed = False
    if not group.public and group.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to view this group!'}), 403
    if group.public and group.user_id != current_user.id:
        isUserAllowed = False
    else:
        isUserAllowed = True
    recipes = Data.query.filter_by(group_id=group_id).all()
    
    recipes_list = [{'id': recipe.id, 'recipe': recipe.recipe, 'image_path': recipe.image_path, 'instructions': recipe.instructions, 'cooking_time':recipe.cooking_time, 'recipe_type': recipe.recipe_type, 'public': recipe.public, 'difficulty_level':recipe.difficulty_level,"username" : (User.query.filter_by(id=recipe.user_id).first()).username} for recipe in recipes]

    return jsonify({'recipes': recipes_list, 'current_user_id': current_user.id , "isUserAllowed": isUserAllowed}), 200



# @views.route('/create-group', methods=['GET', 'POST'])
# @jwt_required()
# def create_group():
#     current_user = User.query.get(get_jwt_identity())
#     if request.method == 'POST':
#         name = request.form.get('name')
#         description = request.form.get('description')
#         public = 'public' in request.form

#         if len(name) < 1:
#             flash('Group name is too short!', category='error')
#         else:
#             new_group = Group(name=name, description=description, user_id=current_user.id, public=public)
#             db.session.add(new_group)
#             db.session.commit()
#             flash('Group created!', category='success')
#             return redirect(url_for('views.home'))
#     return jsonify(new_group, user = current_user)
    # return render_template('create_group.html', user=current_user)

# @views.route('/create-group', methods=['POST'])
# @jwt_required()
# def create_group():
#     current_user = User.query.get(get_jwt_identity())
#     data = request.json  # Change this line to get JSON data

#     name = data.get('name')
#     description = data.get('description')
#     public = data.get('isPublic', False)  # Default to False if not provided

#     if len(name) < 1:
#         return jsonify({'error': 'Group name is too short!'}), 400
#     else:
#         new_group = Group(name=name, description=description, user_id=current_user.id, public=public)
#         db.session.add(new_group)
#         db.session.commit()
#         return jsonify({'message': 'Group created!', 'group': new_group}), 201

@views.route('/create-group', methods=['POST'])
@jwt_required()
def create_group():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        if not current_user:
            return jsonify({'error': 'User not found!'}), 404

        data = request.json
        name = data.get('name')
        description = data.get('description')
        public = data.get('isPublic', False)

        if len(name) < 1:
            return jsonify({'error': 'Group name is too short!'}), 400

        new_group = Group(name=name, description=description, user_id=current_user.id, public=public)
        
        db.session.add(new_group)
        db.session.commit()

        # Serialize the new_group object to a dictionary
        group_dict = {
            'id': new_group.id,
            'name': new_group.name,
            'description': new_group.description,
            'user_id': new_group.user_id,
            'public': new_group.public
        }

        return jsonify({'message': 'Group created!', 'group': group_dict}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")  # Print the error message
        return jsonify({'error': 'An error occurred while creating the group.'}), 500

# @views.route('/edit-group/<int:group_id>', methods=['GET', 'POST'])
# =======

# @views.route('/edit-group/<int:group_id>', methods=['POST'])
# @jwt_required()
# def edit_group(group_id):
    current_user = User.query.get(get_jwt_identity())
    group = Group.query.get_or_404(group_id)
    if group.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to edit this group.'}), 403

    data = request.json
    group.name = data.get('name')
    group.description = data.get('description')
    group.public = data.get('public', group.public)
    
    db.session.commit()
    
    group_dict = {
        'id': group.id,
        'name': group.name,
        'description': group.description,
        'user_id': group.user_id,
        'public': group.public
    }

    return jsonify({'message': 'Group has been updated!', 'group': group_dict}), 200
@views.route('/edit-group/<int:group_id>', methods=['POST'])
@jwt_required()
def edit_group(group_id):
    current_user = User.query.get(get_jwt_identity())
    group = Group.query.get_or_404(group_id)
    
    if group.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to edit this group.'}), 403

    data = request.json
    group.name = data.get('name', group.name)
    group.description = data.get('description', group.description)
    group.public = data.get('public', group.public)
    
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    group_dict = {
        'id': group.id,
        'name': group.name,
        'description': group.description,
        'user_id': group.user_id,
        'public': group.public
    }

    return jsonify({'message': 'Group has been updated!', 'group': group_dict}), 200


# @views.route('/delete-group/<int:group_id>', methods=['POST'])
# @jwt_required()
# def delete_group(group_id):
#     current_user = User.query.get(get_jwt_identity())
#     group = Group.query.get_or_404(group_id)
#     if group and group.user_id == current_user.id:
#         Data.query.filter_by(group_id=group_id).delete()
#         db.session.delete(group)
#         db.session.commit()
#         flash('Group deleted!', category='success')
#     else:
#         flash('You do not have permission to delete this group!', category='error')
#     return redirect(url_for('views.home'))
@views.route('/delete-group/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    current_user = User.query.get(get_jwt_identity())
    group = Group.query.get_or_404(group_id)
    if group.user_id != current_user.id:
        return jsonify({'message': 'You do not have permission to delete this group.'}), 403

    db.session.delete(group)
    db.session.commit()
    return jsonify({'message': 'Group has been deleted successfully!'}), 200


# @views.route('/add-recipe/<int:group_id>', methods=['GET', 'POST'])
# @jwt_required()
# def add_recipe(group_id):
#     current_user = User.query.get(get_jwt_identity())
#     if group_id is None:
#         flash('Please select a group to add a recipe to.', category='error')
#         return redirect(url_for('views.home'))

#     group = Group.query.get_or_404(group_id)

#     if request.method == 'POST':
#         recipe_name = request.form.get('name')
#         ingredient_quantities = request.form.getlist('ingredient_quantities[]')
#         ingredient_names = request.form.getlist('ingredient_names[]')
#         instructions = request.form.get('instructions')
#         recipe_image = request.files.get('image')
#         cooking_time = request.form.get('cooking_time')
#         difficulty_level = request.form.get('difficulty_level')
#         recipe_type = request.form.get('recipe_type')
#         public= request.form.get('public')

#         if not recipe_name or not ingredient_names or not instructions:
#             flash('Recipe name, ingredients, and instructions are required!', category='error')
#             return redirect(url_for('views.add_recipe', group_id=group_id))

#         if recipe_image:
#             filename = secure_filename(recipe_image.filename)
#             static_folder = os.path.join(current_app.root_path, 'static')
#             if not os.path.exists(static_folder):
#                 os.makedirs(static_folder)
#             image_path = os.path.join(static_folder, filename)
#             recipe_image.save(image_path)
#             relative_image_path = os.path.join('static', filename)
#         else:
#             relative_image_path = None

#         new_recipe = Data(
#             recipe=recipe_name,
#             image_path=relative_image_path,
#             instructions=instructions,
#             user_id=current_user.id,
#             public=True,
#             group_id=group_id,
#             cooking_time=cooking_time,
#             difficulty_level=difficulty_level,
#             recipe_type=recipe_type
#         )
#         db.session.add(new_recipe)
#         db.session.commit()

#         for quantity, name in zip(ingredient_quantities, ingredient_names):
#             new_ingredient = Ingredient(quantity=quantity, name=name, data_id=new_recipe.id)
#             db.session.add(new_ingredient)

#         db.session.commit()
#         flash(f'Recipe added to {group.name}!', category='success')
#         return redirect(url_for('views.group_recipes', group_id=group_id))

#     return render_template('add_recipe.html', user=current_user, group=group)

# @views.route('/add-recipe/<int:group_id>', methods=['POST'])
# @jwt_required()
# def add_recipe(group_id):
#     current_user = User.query.get(get_jwt_identity())
#     if group_id is None:
#         return jsonify({'error': 'Please select a group to add a recipe to.'}), 400

#     group = Group.query.get_or_404(group_id)

#     data = request.form
#     recipe_name = data.get('name')
#     ingredient_quantities = data.getlist('ingredient_quantities[]')
#     ingredient_names = data.getlist('ingredient_names[]')
#     instructions = data.get('instructions')
#     recipe_image = request.files.get('image')
#     cooking_time = data.get('cooking_time')
#     difficulty_level = data.get('difficulty_level')
#     recipe_type = data.get('recipe_type')
#     public = data.get('public', True)

#     if not recipe_name or not ingredient_names or not instructions:
#         return jsonify({'error': 'Recipe name, ingredients, and instructions are required!'}), 400

#     if recipe_image:
#         filename = secure_filename(recipe_image.filename)
#         static_folder = os.path.join(current_app.root_path, 'static')
#         if not os.path.exists(static_folder):
#             os.makedirs(static_folder)
#         image_path = os.path.join(static_folder, filename)
#         recipe_image.save(image_path)
#         relative_image_path = os.path.join('static', filename)
#     else:
#         relative_image_path = None

#     new_recipe = Data(
#         recipe=recipe_name,
#         image_path=relative_image_path,
#         instructions=instructions,
#         user_id=current_user.id,
#         public=True,
#         group_id=group_id,
#         cooking_time=cooking_time,
#         difficulty_level=difficulty_level,
#         recipe_type=recipe_type
#     )
#     db.session.add(new_recipe)
#     db.session.commit()

#     for quantity, name in zip(ingredient_quantities, ingredient_names):
#         new_ingredient = Ingredient(quantity=quantity, name=name, data_id=new_recipe.id)
#         db.session.add(new_ingredient)

#     db.session.commit()
    
#     recipe_dict = {
#         'id': new_recipe.id,
#         'recipe': new_recipe.recipe,
#         'image_path': new_recipe.image_path,
#         'instructions': new_recipe.instructions,
#         'cooking_time': new_recipe.cooking_time,
#         'difficulty_level': new_recipe.difficulty_level,
#         'recipe_type': new_recipe.recipe_type,
#         'public': new_recipe.public
#     }

#     return jsonify({'message': f'Recipe added to {group.name}!', 'recipe': recipe_dict}), 201
# @views.route('/add-recipe/<int:group_id>', methods=['POST'])
# @jwt_required()
# def add_recipe(group_id):
    current_user = User.query.get(get_jwt_identity())
    if group_id is None:
        return jsonify({'error': 'Please select a group to add a recipe to.'}), 400

    group = Group.query.get_or_404(group_id)

    recipe_name = request.form.get('name')
    ingredient_quantities = request.form.getlist('ingredient_quantities[]')
    ingredient_names = request.form.getlist('ingredient_names[]')
    instructions = request.form.get('instructions')
    recipe_image = request.files.get('recipe_image')
    cooking_time = request.form.get('cooking_time')
    difficulty_level = request.form.get('difficulty_level')
    recipe_type = request.form.get('recipe_type')
    public = request.form.get('public', '0') == '1'

    if not recipe_name or not ingredient_names or not instructions:
        return jsonify({'error': 'Recipe name, ingredients, and instructions are required!'}), 400

    
    if recipe_image:
        filename = secure_filename(recipe_image.filename)
        static_folder = os.path.join(current_app.root_path, 'static')
        if not os.path.exists(static_folder):
            os.makedirs(static_folder)
        image_path = os.path.join(static_folder, filename)
        recipe_image.save(image_path)
        relative_image_path = os.path.join('static', filename)
    else:
        relative_image_path = None

    new_recipe = Data(
        recipe=recipe_name,
        image_path=image_path,
        instructions=instructions,
        user_id=current_user.id,
        public=public,
        group_id=group_id,
        cooking_time=cooking_time,
        difficulty_level=difficulty_level,
        recipe_type=recipe_type
    )
    db.session.add(new_recipe)
    db.session.commit()

    for quantity, name in zip(ingredient_quantities, ingredient_names):
        new_ingredient = Ingredient(quantity=quantity, name=name, data_id=new_recipe.id)
        db.session.add(new_ingredient)

    db.session.commit()
    return jsonify({'success': f'Recipe added to {group.name}!'}), 201

@views.route('/add-recipe/<int:group_id>', methods=['POST'])
@jwt_required()
def add_recipe(group_id):
    current_user = User.query.get(get_jwt_identity())
    if group_id is None:
        return jsonify({'error': 'Please select a group to add a recipe to.'}), 400

    group = Group.query.get_or_404(group_id)
    print(request.form)
    recipe_name = request.form.get('name')
    ingredient_quantities = request.form.getlist('ingredient_quantities[]')
    ingredient_names = request.form.getlist('ingredient_names[]')
    instructions = request.form.get('instructions')
    recipe_image = request.files.get('recipe_image')
    cooking_time = request.form.get('cooking_time')
    difficulty_level = request.form.get('difficulty_level')
    recipe_type = request.form.get('recipe_type')
    public = request.form.get('public', '0') == '1'

    if not recipe_name or not ingredient_names or not instructions:
        return jsonify({'error': 'Recipe name, ingredients, and instructions are required!'}), 400

    if recipe_image:
        filename = secure_filename(recipe_image.filename)
        upload_folder = os.path.join(current_app.root_path, 'static')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        filepath = os.path.join(upload_folder, filename)
        recipe_image.save(filepath)
        relative_image_path = filename
    else:
        relative_image_path = None

    new_recipe = Data(
        recipe=recipe_name,
        image_path=relative_image_path,  # Save relative path
        instructions=instructions,
        user_id=current_user.id,
        public=public,
        group_id=group_id,
        cooking_time=cooking_time,
        difficulty_level=difficulty_level,
        recipe_type=recipe_type
    )
    db.session.add(new_recipe)
    db.session.commit()

    for quantity, name in zip(ingredient_quantities, ingredient_names):
        new_ingredient = Ingredient(quantity=quantity, name=name, data_id=new_recipe.id)
        db.session.add(new_ingredient)

    db.session.commit()
    return jsonify({'success': f'Recipe added to {group.name}!'}), 201


# @views.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
# @jwt_required()
# def delete_recipe(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)
    
#     if recipe.user_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to delete this recipe!'}), 403

#     try:
#         Ingredient.query.filter_by(data_id=recipe.id).delete()
#         db.session.delete(recipe)
#         db.session.commit()
#         return jsonify({'message': 'Recipe deleted successfully!'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': f'An error occurred while deleting the recipe: {str(e)}'}), 500

@views.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    current_user = User.query.get(get_jwt_identity())
    recipe = Data.query.get_or_404(recipe_id)
    
    if recipe.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to delete this recipe!'}), 403

    try:
        Ingredient.query.filter_by(data_id=recipe.id).delete()
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({'message': 'Recipe deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred while deleting the recipe: {str(e)}'}), 500


# @views.route('/edit-recipe/<int:recipe_id>', methods=['POST'])
# @jwt_required()
# def edit_recipe(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)
#     if recipe.user_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to edit this recipe!'}), 403

#     data = request.form
#     recipe_name = data.get('name')
#     ingredient_quantities = data.getlist('ingredient_quantities[]')
#     ingredient_names = data.getlist('ingredient_names[]')
#     ingredient_ids = data.getlist('ingredient_ids[]')
#     instructions = data.get('instructions')
#     recipe_image = request.files.get('image')
#     cooking_time = data.get('cooking_time')
#     difficulty_level = data.get('difficulty_level')
#     recipe_type = data.get('recipe_type')

#     if not recipe_name or not ingredient_names or not instructions:
#         return jsonify({'error': 'All fields are required!'}), 400

#     recipe.recipe = recipe_name
#     recipe.instructions = instructions
#     recipe.cooking_time = cooking_time
#     recipe.difficulty_level = difficulty_level
#     recipe.recipe_type = recipe_type

#     if recipe_image:
#         filename = secure_filename(recipe_image.filename)
#         image_path = os.path.join('static', 'images', filename)
#         recipe_image.save(os.path.join(current_app.root_path, image_path))
#         recipe.image_path = image_path

#     existing_ingredients = {str(i.id): i for i in recipe.ingredients}
#     for quantity, name, ing_id in zip(ingredient_quantities, ingredient_names, ingredient_ids):
#         if ing_id:
#             if ing_id in existing_ingredients:
#                 existing_ingredients[ing_id].quantity = quantity
#                 existing_ingredients[ing_id].name = name
#                 del existing_ingredients[ing_id]
#             else:
#                 return jsonify({'error': f'Ingredient ID {ing_id} not found!'}), 404
#         else:
#             new_ingredient = Ingredient(quantity=quantity, name=name, data_id=recipe.id)
#             db.session.add(new_ingredient)

#     for ing in existing_ingredients.values():
#         db.session.delete(ing)

#     db.session.commit()
    
#     recipe_dict = {
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'ingredients': [{'id': ing.id, 'quantity': ing.quantity, 'name': ing.name} for ing in recipe.ingredients]
#     }

#     return jsonify({'message': 'Recipe has been updated!', 'recipe': recipe_dict}), 200

@views.route('/edit-recipe/<int:recipe_id>', methods=['POST'])
@jwt_required()
def edit_recipe(recipe_id):
    current_user = User.query.get(get_jwt_identity())
    recipe = Data.query.get_or_404(recipe_id)
    if recipe.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to edit this recipe!'}), 403
    print(request.form)
    data = request.form
    recipe_name = data.get('name')
    ingredient_quantities = data.getlist('ingredient_quantities[]')
    ingredient_names = data.getlist('ingredient_names[]')
    ingredient_ids = data.getlist('ingredient_ids[]')
    instructions = data.get('instructions')
    recipe_image = request.files.get('image')
    cooking_time = data.get('cooking_time')
    difficulty_level = data.get('difficulty_level')
    recipe_type = data.get('recipe_type')

    if not recipe_name or not ingredient_names or not instructions:
        return jsonify({'error': 'All fields are required!'}), 400

    recipe.recipe = recipe_name
    recipe.instructions = instructions
    recipe.cooking_time = cooking_time
    recipe.difficulty_level = difficulty_level
    recipe.recipe_type = recipe_type

    if recipe_image:
        filename = secure_filename(recipe_image.filename)
        image_path = os.path.join('static', 'images', filename)
        recipe_image.save(os.path.join(current_app.root_path, image_path))
        recipe.image_path = image_path

    existing_ingredients = {str(i.id): i for i in recipe.ingredients}
    for quantity, name, ing_id in zip(ingredient_quantities, ingredient_names, ingredient_ids):
        if ing_id:
            if ing_id in existing_ingredients:
                existing_ingredients[ing_id].quantity = quantity
                existing_ingredients[ing_id].name = name
                del existing_ingredients[ing_id]
            else:
                return jsonify({'error': f'Ingredient ID {ing_id} not found!'}), 404
        else:
            new_ingredient = Ingredient(quantity=quantity, name=name, data_id=recipe.id)
            db.session.add(new_ingredient)

    for ing in existing_ingredients.values():
        db.session.delete(ing)

    db.session.commit()
    
    recipe_dict = {
        'id': recipe.id,
        'recipe': recipe.recipe,
        'image_path': recipe.image_path,
        'instructions': recipe.instructions,
        'cooking_time': recipe.cooking_time,
        'difficulty_level': recipe.difficulty_level,
        'recipe_type': recipe.recipe_type,
        'ingredients': [{'id': ing.id, 'quantity': ing.quantity, 'name': ing.name} for ing in recipe.ingredients]
    }

    return jsonify({'message': 'Recipe has been updated!', 'recipe': recipe_dict}), 200


@views.route('/profile')
@jwt_required()
def profile():
    current_user = User.query.get(get_jwt_identity())
    user_data = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "shopping_list": current_user.shopping_list.split(',') if current_user.shopping_list else []
    }
    return jsonify(user_data)

@views.route('/profile/public-recipes')
@jwt_required()
def public_recipes():
    public_recipes = Data.query.filter_by(public=True).all()
    recipes = [{"id": recipe.id, "recipe": recipe.recipe} for recipe in public_recipes]
    return jsonify(recipes)

@views.route('/profile/personal-recipes')
@jwt_required()
def personal_recipes():
    current_user = User.query.get(get_jwt_identity())
    personal_recipes = Data.query.filter_by(user_id=current_user.id).all()
    recipes = [{"id": recipe.id, "recipe": recipe.recipe, "image_path": recipe.image_path, "cooking_time": recipe.cooking_time, "difficulty_level": recipe.difficulty_level, "instructions": recipe.instructions, "recipe_type":recipe.recipe_type, "public":recipe.public} for recipe in personal_recipes]
    return jsonify(recipes)

@views.route('/profile/groups')
@jwt_required()
def profile_groups():
    current_user = User.query.get(get_jwt_identity())
    groups = Group.query.filter_by(user_id=current_user.id).all()
    groups_data = [{"id": group.id, "name": group.name, "description": group.description} for group in groups]
    return jsonify(groups_data)

@views.route('/profile/usergroups')
@jwt_required()
def user_groups():
    current_user = User.query.get(get_jwt_identity())
    user_groups = Group.query.filter((Group.user_id == current_user.id) | (Group.public == True)).all()
    groups_data = [{"id": group.id, "name": group.name, "description": group.description} for group in user_groups]
    return jsonify(groups_data)

@views.route('/profile/shopping-list', methods=['GET', 'POST'])
@jwt_required()
def shopping_list():
    current_user = User.query.get(get_jwt_identity())
    if request.method == 'POST':
        ingredient = request.json.get('ingredient')
        if ingredient:
            if current_user.shopping_list:
                shopping_list = current_user.shopping_list.split(',')
            else:
                shopping_list = []
            shopping_list.append(ingredient)
            current_user.shopping_list = ','.join(shopping_list)
            db.session.commit()
            return jsonify({'message': 'Ingredient added to shopping list!'}), 200
        return jsonify({'message': 'Ingredient cannot be empty!'}), 400

    shopping_list = current_user.shopping_list.split(',') if current_user.shopping_list else []
    return jsonify(shopping_list)

@views.route('/profile/shopping-list/remove', methods=['POST'])
@jwt_required()
def remove_from_shopping_list():
    current_user = User.query.get(get_jwt_identity())
    ingredient = request.json.get('ingredient')
    if ingredient and current_user.shopping_list:
        shopping_list = current_user.shopping_list.split(',')
        if ingredient in shopping_list:
            shopping_list.remove(ingredient)
            current_user.shopping_list = ','.join(shopping_list)
            db.session.commit()
            return jsonify({'message': 'Ingredient removed from shopping list!'}), 200
        return jsonify({'message': 'Ingredient not found in shopping list!'}), 400
    return jsonify({'message': 'Invalid request!'}), 400

# @views.route('/recipe/<int:recipe_id>', methods=['GET', 'POST'])
# @jwt_required()
# def recipe_detail(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)
#     if recipe.user_id != current_user.id and not recipe.public:
#         return jsonify({'message': 'You do not have permission to view this recipe!'}), 403

#     if request.method == 'POST':
#         data = request.json
#         if 'thumbs_up' in data or 'thumbs_down' in data:
#             thumbs_up = 'thumbs_up' in data
#             existing_review = Review.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
#             if existing_review:
#                 existing_review.thumbs_up = thumbs_up
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been updated.'}), 200
#             else:
#                 new_review = Review(thumbs_up=thumbs_up, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_review)
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been added.'}), 200

#         if 'comment_text' in data:
#             comment_text = data.get('comment_text')
#             if comment_text:
#                 new_comment = Comment(text=comment_text, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_comment)
#                 db.session.commit()
#                 return jsonify({'message': 'Your comment has been added.'}), 200
#             return jsonify({'message': 'Comment cannot be empty.'}), 400

#     ingredients = Ingredient.query.filter_by(data_id=recipe_id).all()
#     reviews = Review.query.filter_by(recipe_id=recipe_id).all()
#     comments = Comment.query.filter_by(recipe_id=recipe_id).all()

#     recipe_data = {
#         "id": recipe.id,
#         "recipe": recipe.recipe,
#         "ingredients": [{"id": ingredient.id, "quantity": ingredient.quantity, "name": ingredient.name} for ingredient in ingredients],
#         "instructions": recipe.instructions,
#         "cooking_time": recipe.cooking_time,
#         "difficulty_level": recipe.difficulty_level,
#         "image_path": recipe.image_path,
#         "recipe_type": recipe.recipe_type,
#         "public": recipe.public,
#         "reviews": [{"id": review.id, "thumbs_up": review.thumbs_up, "user_id": review.user_id} for review in reviews],
#         "comments": [{"id": comment.id, "text": comment.text, "user_id": comment.user_id} for comment in comments]
#     }

#     return jsonify(recipe_data)

@views.route('/add-to-shopping-list', methods=['POST'])
@jwt_required()
def add_to_shopping_list():
    current_user = User.query.get(get_jwt_identity())
    ingredient_id = request.json.get('ingredient_id')
    ingredient = Ingredient.query.get_or_404(ingredient_id)

    if ingredient:
        if current_user.shopping_list:
            shopping_list = current_user.shopping_list.split(',')
        else:
            shopping_list = []

        shopping_item = f"{ingredient.quantity} {ingredient.name}"
        if shopping_item not in shopping_list:
            shopping_list.append(shopping_item)
            current_user.shopping_list = ','.join(shopping_list)
            db.session.commit()
            return jsonify({'message': 'Ingredient added to shopping list!'}), 200
        return jsonify({'message': 'Ingredient already in shopping list!'}), 200
    return jsonify({'message': 'Invalid ingredient!'}), 400


# @views.route('/recipe/<int:recipe_id>', methods=['GET', 'POST'])
# @jwt_required()
# def recipe_detail(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)

#     if recipe.user_id != current_user.id and not recipe.public:
#         return jsonify({'error': 'You do not have permission to view this recipe!'}), 403

#     ingredients = Ingredient.query.filter_by(data_id=recipe_id).all()
#     reviews = Review.query.filter_by(recipe_id=recipe_id).all()
#     comments = Comment.query.filter_by(recipe_id=recipe_id).all()

#     if request.method == 'POST':
#         if 'thumbs_up' in request.form or 'thumbs_down' in request.form:
#             thumbs_up = 'thumbs_up' in request.form
#             existing_review = Review.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
#             if existing_review:
#                 existing_review.thumbs_up = thumbs_up
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been updated.'}), 200
#             else:
#                 new_review = Review(thumbs_up=thumbs_up, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_review)
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been added.'}), 201

#         if 'comment' in request.form:
#             comment_text = request.form.get('comment_text')
#             if comment_text:
#                 new_comment = Comment(text=comment_text, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_comment)
#                 db.session.commit()
#                 return jsonify({'message': 'Your comment has been added.'}), 201
#             else:
#                 return jsonify({'error': 'Comment cannot be empty.'}), 400

#         if 'add_to_favourites' in request.form:
#             if current_user not in recipe.favourited_by:
#                 recipe.favourited_by.append(current_user)
#                 db.session.commit()
#                 return jsonify({'message': 'Recipe added to favourites.'}), 200
#             else:
#                 return jsonify({'error': 'Recipe is already in your favourites.'}), 400

#     recipe_data = {
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'public': recipe.public,
#         'ingredients': [{'quantity': ing.quantity, 'name': ing.name} for ing in ingredients],
#         'reviews': [{'user_id': rev.user_id, 'thumbs_up': rev.thumbs_up} for rev in reviews],
#         'comments': [{'user_id': com.user_id, 'text': com.text} for com in comments]
#     }

#     return jsonify(recipe_data), 200

# @views.route('/favourites', methods=['GET'])
# @jwt_required()
# def favourites():
#     current_user = User.query.get(get_jwt_identity())
#     favourite_recipes = current_user.favourites.all()

#     recipes_data = [{
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'public': recipe.public,
#         'group_id': recipe.group_id
#     } for recipe in favourite_recipes]

#     return jsonify(recipes_data), 200

# @views.route('/recipe/<int:recipe_id>', methods=['GET', 'POST'])
# @jwt_required()
# def recipe_detail(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)

#     if recipe.user_id != current_user.id and not recipe.public:
#         return jsonify({'error': 'You do not have permission to view this recipe!'}), 403

#     ingredients = Ingredient.query.filter_by(data_id=recipe_id).all()
#     reviews = Review.query.filter_by(recipe_id=recipe_id).all()
#     comments = Comment.query.filter_by(recipe_id=recipe_id).all()

#     if request.method == 'POST':
#         data = request.json

#         # Handling Like/Dislike
#         if 'thumbs_up' in data or 'thumbs_down' in data:
#             thumbs_up = 'thumbs_up' in data
#             existing_review = Review.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
#             if existing_review:
#                 existing_review.thumbs_up = thumbs_up
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been updated.'}), 200
#             else:
#                 new_review = Review(thumbs_up=thumbs_up, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_review)
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been added.'}), 201

#         # Handling Comment
#         if 'comment_text' in data:
#             comment_text = data.get('comment_text')
#             if comment_text:
#                 new_comment = Comment(text=comment_text, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_comment)
#                 db.session.commit()
#                 return jsonify({'message': 'Your comment has been added.'}), 201
#             else:
#                 return jsonify({'error': 'Comment cannot be empty.'}), 400

#         # Handling Add to Favourites
#         if 'add_to_favourites' in data:
#             if current_user not in recipe.favourited_by:
#                 recipe.favourited_by.append(current_user)
#                 db.session.commit()
#                 return jsonify({'message': 'Recipe added to favourites.'}), 200
#             else:
#                 return jsonify({'error': 'Recipe is already in your favourites.'}), 400

#     recipe_data = {
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'public': recipe.public,
#         'ingredients': [{'quantity': ing.quantity, 'name': ing.name} for ing in ingredients],
#         'reviews': [{'user_id': rev.user_id, 'thumbs_up': rev.thumbs_up} for rev in reviews],
#         'comments': [{'user_id': com.user_id, 'text': com.text} for com in comments]
#     }

#     return jsonify(recipe_data), 200

# @views.route('/recipe/<int:recipe_id>', methods=['GET', 'POST'])
# @jwt_required()
# def recipe_detail(recipe_id):
#     current_user = User.query.get(get_jwt_identity())
#     recipe = Data.query.get_or_404(recipe_id)

#     if recipe.user_id != current_user.id and not recipe.public:
#         return jsonify({'error': 'You do not have permission to view this recipe!'}), 403

#     ingredients = Ingredient.query.filter_by(data_id=recipe_id).all()
#     reviews = Review.query.filter_by(recipe_id=recipe_id).all()
#     comments = Comment.query.filter_by(recipe_id=recipe_id).all()

#     # Count likes and dislikes
#     likes_count = Review.query.filter_by(recipe_id=recipe_id, thumbs_up=True).count()
#     dislikes_count = Review.query.filter_by(recipe_id=recipe_id, thumbs_up=False).count()

#     if request.method == 'POST':
#         if 'thumbs_up' in request.json or 'thumbs_down' in request.json:
#             thumbs_up = request.json.get('thumbs_up', False)
#             existing_review = Review.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
#             if existing_review:
#                 existing_review.thumbs_up = thumbs_up
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been updated.'}), 200
#             else:
#                 new_review = Review(thumbs_up=thumbs_up, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_review)
#                 db.session.commit()
#                 return jsonify({'message': 'Your review has been added.'}), 201

#         if 'comment_text' in request.json:
#             comment_text = request.json.get('comment_text')
#             if comment_text:
#                 new_comment = Comment(text=comment_text, user_id=current_user.id, recipe_id=recipe_id)
#                 db.session.add(new_comment)
#                 db.session.commit()
#                 return jsonify({'message': 'Your comment has been added.'}), 201
#             else:
#                 return jsonify({'error': 'Comment cannot be empty.'}), 400

#         if 'add_to_favourites' in request.json:
#             if current_user not in recipe.favourited_by:
#                 recipe.favourited_by.append(current_user)
#                 db.session.commit()
#                 return jsonify({'message': 'Recipe added to favourites.'}), 200
#             else:
#                 return jsonify({'error': 'Recipe is already in your favourites.'}), 400

#     recipe_data = {
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'public': recipe.public,
#         'ingredients': [{'quantity': ing.quantity, 'name': ing.name} for ing in ingredients],
#         'reviews': [{'user_id': rev.user_id, 'thumbs_up': rev.thumbs_up} for rev in reviews],
#         'comments': [{'user_id': com.user_id, 'text': com.text} for com in comments],
#         'likes_count': likes_count,
#         'dislikes_count': dislikes_count
#     }

#     return jsonify(recipe_data), 200

@views.route('/recipe/<int:recipe_id>', methods=['GET', 'POST'])
@jwt_required()
def recipe_detail(recipe_id):
    current_user = User.query.get(get_jwt_identity())
    recipe = Data.query.get_or_404(recipe_id)
    isUserAllowed=False
    if recipe.user_id != current_user.id and not recipe.public:
        return jsonify({'error': 'You do not have permission to view this recipe!'}), 403
    
    if recipe.public and recipe.user_id != current_user.id:
        isUserAllowed = False
    else:
        isUserAllowed = True
    ingredients = Ingredient.query.filter_by(data_id=recipe_id).all()
    reviews = Review.query.filter_by(recipe_id=recipe_id).all()
    comments = Comment.query.filter_by(recipe_id=recipe_id).all()

    # Count likes and dislikes
    likes_count = Review.query.filter_by(recipe_id=recipe_id, thumbs_up=True).count()
    dislikes_count = Review.query.filter_by(recipe_id=recipe_id, thumbs_up=False).count()

    if request.method == 'POST':
        if 'thumbs_up' in request.json or 'thumbs_down' in request.json:
            thumbs_up = request.json.get('thumbs_up', False)
            existing_review = Review.query.filter_by(user_id=current_user.id, recipe_id=recipe_id).first()
            if existing_review:
                existing_review.thumbs_up = thumbs_up
                db.session.commit()
                return jsonify({'message': 'Your review has been updated.'}), 200
            else:
                new_review = Review(thumbs_up=thumbs_up, user_id=current_user.id, recipe_id=recipe_id)
                db.session.add(new_review)
                db.session.commit()
                return jsonify({'message': 'Your review has been added.'}), 201

        if 'comment_text' in request.json:
            comment_text = request.json.get('comment_text')
            if comment_text:
                new_comment = Comment(text=comment_text, user_id=current_user.id, recipe_id=recipe_id)
                db.session.add(new_comment)
                db.session.commit()
                return jsonify({'message': 'Your comment has been added.'}), 201
            else:
                return jsonify({'error': 'Comment cannot be empty.'}), 400

        if 'add_to_favourites' in request.json:
            if current_user not in recipe.favourited_by:
                recipe.favourited_by.append(current_user)
                db.session.commit()
                return jsonify({'message': 'Recipe added to favourites.'}), 200
            else:
                return jsonify({'error': 'Recipe is already in your favourites.'}), 400

    recipe_data = {
        'id': recipe.id,
        'recipe': recipe.recipe,
        'image_path': recipe.image_path,
        'instructions': recipe.instructions,
        'cooking_time': recipe.cooking_time,
        'difficulty_level': recipe.difficulty_level,
        'recipe_type': recipe.recipe_type,
        'public': recipe.public,
        'ingredients': [{'quantity': ing.quantity, 'name': ing.name} for ing in ingredients],
        'reviews': [{'user_id': rev.user_id, 'thumbs_up': rev.thumbs_up} for rev in reviews],
        'comments': [{'username': User.query.get(com.user_id).username, 'text': com.text} for com in comments],
        'likes_count': likes_count,
        'dislikes_count': dislikes_count,
        'isUserAllowed':isUserAllowed
    }

    return jsonify(recipe_data), 200


# @views.route('/favourites', methods=['GET'])
# @jwt_required()
# def favourites():
#     current_user = User.query.get(get_jwt_identity())
#     favourite_recipes = current_user.favourites.all()

#     recipes_data = [{
#         'id': recipe.id,
#         'recipe': recipe.recipe,
#         'image_path': recipe.image_path,
#         'instructions': recipe.instructions,
#         'cooking_time': recipe.cooking_time,
#         'difficulty_level': recipe.difficulty_level,
#         'recipe_type': recipe.recipe_type,
#         'public': recipe.public,
#         'group_id': recipe.group_id
#     } for recipe in favourite_recipes]

#     return jsonify(recipes_data), 200
@views.route('/favourites', methods=['GET'])
@jwt_required()
def favourites():
    current_user = User.query.get(get_jwt_identity())
    favourite_recipes = current_user.favourites.all()

    recipes_data = [{
        'id': recipe.id,
        'recipe': recipe.recipe,
        'image_path': recipe.image_path,
        'instructions': recipe.instructions,
        'cooking_time': recipe.cooking_time,
        'difficulty_level': recipe.difficulty_level,
        'recipe_type': recipe.recipe_type,
        'public': recipe.public,
        'group_id': recipe.group_id
    } for recipe in favourite_recipes]

    return jsonify(recipes_data), 200


@views.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()  # Retrieve the user ID from the JWT token
    return jsonify({'user_id': current_user_id}), 200




@views.route('/recipe-creator', methods=['GET'])
@jwt_required()
def get_recipe_creator(recipe_id):
    # Retrieve the recipe using the provided recipe_id
    current_user = User.query.get(get_jwt_identity())
    recipe = Data.query.filter_by(id=recipe_id).first()

    if recipe:
        # Retrieve the user who created the recipe
        user = User.query.filter_by(id=recipe.user_id).first()

        if user:
            # Return the username of the creator
            return jsonify({'username': user.username}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Recipe not found'}), 404


@views.route('/top-recipes-week', methods=['GET'])
@jwt_required()
def top_recipes_week():
    current_user = User.query.get(get_jwt_identity())

    # Calculate the start of the week (Monday)
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())

    # Query for the top 5 recipes with the most likes in the current week
    top_recipes_query = db.session.query(
        Data.id,
        Data.recipe,
        Data.image_path,
        Data.cooking_time,
        Data.difficulty_level,
        Data.recipe_type,
        func.count(Review.id).label('likes_count')
    ).join(Review, Review.recipe_id == Data.id
    ).filter(
        Review.thumbs_up == True,
        Review.timestamp >= start_of_week,
        Data.public == True  # Only consider public recipes
    ).group_by(
        Data.id
    ).order_by(
        func.count(Review.id).desc()
    ).limit(5).all()

    # Serialize the top recipes
    top_recipes = []
    for recipe in top_recipes_query:
        ingredients = Ingredient.query.filter_by(data_id=recipe.id).all()
        top_recipes.append({
            'id': recipe.id,
            'recipe': recipe.recipe,
            'image_path': recipe.image_path,
            'cooking_time': recipe.cooking_time,
            'difficulty_level': recipe.difficulty_level,
            'recipe_type': recipe.recipe_type,
            'likes_count': recipe.likes_count,
            'ingredients': [{'quantity': ing.quantity, 'name': ing.name} for ing in ingredients],
        })

    return jsonify(top_recipes), 200




@views.route('/search-recipes', methods=['GET'])
@jwt_required()
def search_recipes():
    current_user = User.query.get(get_jwt_identity())

    # Get query parameters
    search_by = request.args.get('search_by', 'recipe_name')  # Get the search by value from query params
    search_value = request.args.get('search_value', '')       # Get the search value

    # Build query
    query = Data.query

    if search_by == 'recipe_name' and search_value:
        query = query.filter(Data.recipe.ilike(f'%{search_value}%'))
    elif search_by == 'ingredient_name' and search_value:
        # Join with Ingredient table to filter by ingredient name
        query = query.join(Ingredient).filter(Ingredient.name.ilike(f'%{search_value}%'))
    elif search_by == 'difficulty_level' and search_value:
        query = query.filter(Data.difficulty_level == search_value)
    elif search_by == 'cooking_time':
        try:
            # min_cooking_time, max_cooking_time = map(int, search_value.split('-'))
            query = query.filter(Data.cooking_time.between(0, search_value))
        except ValueError:
            return jsonify({"error": "Invalid cooking time range"}), 400
    elif search_by == 'recipe_type' and search_value:
        query = query.filter(Data.recipe_type == search_value)

    # Ensure only public recipes are returned
    query = query.filter(Data.public == True)

    # Execute query and get results
    results = query.all()

    # Prepare results for response with recipe detail URL
    recipes = [
        {
            'id': recipe.id,
            'recipe': recipe.recipe,
            'image_path': recipe.image_path,
            'instructions': recipe.instructions,
            'cooking_time': recipe.cooking_time,
            'difficulty_level': recipe.difficulty_level,
            'recipe_type': recipe.recipe_type,
            'public': recipe.public,
        }
        for recipe in results
    ]

    return jsonify(recipes), 200

 