from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder
import numpy as np
from .models import CollectionItem, UserAccount


def vectorize_items(items):
    encoders = {
        'occasion': LabelEncoder(),
        'season': LabelEncoder(),
        'style': LabelEncoder(),
        'clothing_type': LabelEncoder()
    }

    for field in encoders:
        values = [getattr(item, field) for item in items]
        if not values:
            raise ValueError(f"No data for field '{field}' to train encoder.")
        encoders[field].fit(values)

    vectors = []
    for item in items:
        vector = [
            encoders['occasion'].transform([item.occasion])[0],
            encoders['season'].transform([item.season])[0],
            encoders['style'].transform([item.style])[0],
            encoders['clothing_type'].transform([item.clothing_type])[0]
        ]
        vectors.append(vector)

    return np.array(vectors), encoders

def vectorize_input(data, encoders):
    try:
        return np.array([[
            encoders['occasion'].transform([data['occasion']])[0],
            encoders['season'].transform([data['season']])[0],
            encoders['style'].transform([data['style']])[0],
            encoders['clothing_type'].transform([data['clothing_type']])[0]
        ]])
    except ValueError as ve:
        raise ValueError(f"Input value not seen during training: {ve}")


def ml_recommend_outfits(user_id, occasion, season, style, clothing_preferences, top_n=3):
    items = CollectionItem.objects.filter(user=user_id, clothing_type__in=clothing_preferences)
    
    user_height = UserAccount.objects.get(pk=user_id).height
    user_weight = UserAccount.objects.get(pk=user_id).weight
    
    print(f"User height: {user_height}, User weight: {user_weight}")

    if not items:
        return []

    vectors, encoders = vectorize_items(items)
    knn = NearestNeighbors(n_neighbors=min(top_n, len(items)))
    knn.fit(vectors)

    # Use a set to track seen item IDs to prevent duplicates
    seen_item_ids = set()
    recommendations = []
    
    for clothing_type in clothing_preferences:
        try:
            input_vector = vectorize_input({
                'occasion': occasion,
                'season': season,
                'style': style,
                'clothing_type': clothing_type
            }, encoders)

            distances, indices = knn.kneighbors(input_vector)
            for idx in indices[0]:
                item = items[int(idx)]
                if item.id not in seen_item_ids:  # Only add if not already seen
                    seen_item_ids.add(item.id)
                    recommendations.append(item)
        except ValueError as e:
            print(f"⚠️ Skipping clothing_type='{clothing_type}' due to encoding error: {e}")

    return recommendations
