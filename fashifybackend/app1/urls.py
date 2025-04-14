from django.urls import path
from . import views
from .views import MyTokenObtainPairView, AddToCollectionView, UserCollections,UserOtherCollections,DeleteCollectionItem,EditToCollection, CollectionItemDetail, MLBasedOutfitRecommendation, SaveRecentActivityView, UserRecentActivitiesView
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)

urlpatterns = [
    path('', views.getRoutes),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.UserRegistration.as_view(), name='register'),
    path('add-to-collection/', AddToCollectionView.as_view(), name='add-to-collection'),
    path('edit-to-collection/<int:pk>/', EditToCollection.as_view(), name='edit-to-collection'),
    path('collections/<int:pk>',UserCollections.as_view(),name='collections'),
    path('othercollections/<int:pk>/<int:id>', UserOtherCollections.as_view(), name='othercollections'),
    path('single_collections/<int:pk>/', CollectionItemDetail.as_view(), name='single_collections'),
    path('ml-recommendation/', MLBasedOutfitRecommendation.as_view(), name='ml-recommendation'),
    path('save-recent/', SaveRecentActivityView.as_view(), name='save_recent'),
    path('recent-activities/<int:user_id>/', UserRecentActivitiesView.as_view(), name='recent_activities'),
    path('collection/<int:pk>/', DeleteCollectionItem.as_view(), name='delete-collection-item'),

    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)