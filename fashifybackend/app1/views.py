from django.shortcuts import render
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view

from .serializers import UserSerializer, CollectionItemSerializer, CollectionListSerializer, RecentActivitySerializer
from rest_framework import status, permissions
from .models import UserAccount, CollectionItem, RecentActivity
from .recommendation_engine import ml_recommend_outfits
from .serializers import EditCollectionItemSerializer


from rest_framework.generics import ListCreateAPIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework.parsers import MultiPartParser, FormParser



@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/token',
        '/token/refresh'
    ]
    return Response(routes)



class UserRegistration(APIView):
     def post(self, request, format=None):
        password = request.data.get('password')
        email = request.data.get('email')
        print(request.data)
        if not email or not password:
            return Response({'msg':'Please fill all fields'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                return Response({'msg': 'Registration Success'}, status=status.HTTP_201_CREATED)
            
            return Response({'msg':'Registration Failed'})


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['user_id'] = user.id

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    print("hereeee")
    serializer_class = MyTokenObtainPairSerializer
    
    

class AddToCollectionView(APIView):
    def post(self, request, format=None):
        print(request.data)
        serializer = CollectionItemSerializer(data=request.data)
        
        is_valid = serializer.is_valid()
        
        print(serializer.errors)

        if serializer.is_valid():
            serializer.save()
            
            return Response({'msg': 'Item added successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class EditToCollection(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def put(self, request, pk, format=None):
        try:
            collection_item = CollectionItem.objects.get(pk=pk)
        except CollectionItem.DoesNotExist:
            return Response(
                {"error": "Item not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EditCollectionItemSerializer(
            collection_item, 
            data=request.data, 
            partial=True  # Allow partial updates
        )

        if serializer.is_valid():
            # Only update the image if a new one was provided
            if 'image' not in request.data or request.data['image'] == 'undefined':
                # Remove image from serializer data if not provided
                serializer.validated_data.pop('image', None)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class UserCollections(APIView):
    def get(self, request, pk):
        collections = CollectionItem.objects.filter(user=pk)
        serializer = CollectionListSerializer(collections, many=True)
        return Response(serializer.data) 
    
class UserOtherCollections(APIView):
    def get(self, request, pk, id):
        collections = CollectionItem.objects.filter(user=pk).exclude(pk=id)
        serializer = CollectionListSerializer(collections, many=True)
        return Response(serializer.data) 
    

class CollectionItemDetail(APIView):
    def get(self, request, pk):
        try:
            item = CollectionItem.objects.get(pk=pk)
            serializer = CollectionItemSerializer(item, context={'request': request})
            return Response(serializer.data)
        except CollectionItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=404)


class DeleteCollectionItem(APIView):
    def delete(self, request, pk):
        try:
            item = CollectionItem.objects.get(pk=pk)
            item.delete()
            return Response({'msg': 'Item deleted successfully'}, status=status.HTTP_200_OK)
        except CollectionItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MLBasedOutfitRecommendation(APIView):
    def post(self, request):
        print("hereeee", request.data)
        user_id = request.data.get('user_id')
        occasion = request.data.get('occasionType')
        season = request.data.get('weatherType')
        style = request.data.get('fashionStyle')
        preferences = request.data.get('clothingPreferences')

        # Fix data types
        if isinstance(preferences, str):
            preferences = [pref.strip() for pref in preferences.split(',') if pref.strip()]
        if isinstance(style, str):
            styles = [s.strip() for s in style.split(',') if s.strip()]
            style = styles[0] if styles else ""

        if not user_id or not occasion or not season or not style or not preferences:
            return Response({"error": "Missing required fields"}, status=400)

        try:
            from .recommendation_engine import ml_recommend_outfits
            recommended_items = ml_recommend_outfits(
                user_id=user_id,
                occasion=occasion,
                season=season,
                style=style,
                clothing_preferences=preferences,
                top_n=3
            )
            print("recommentaaaa", recommended_items)
            serializer = CollectionListSerializer(recommended_items, many=True)
            return Response({"recommendations": serializer.data})
        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=500)
        
        

class SaveRecentActivityView(APIView):
    def post(self, request):
        user_id = request.data.get('user')
        item_ids = request.data.get('items', [])
        
        if not user_id or not item_ids:
            return Response({'error': 'Missing user or items'}, status=400)
        
        try:
            # Create multiple entries at once
            activities = [
                RecentActivity(user_id=user_id, item_id=item_id)
                for item_id in item_ids
            ]
            RecentActivity.objects.bulk_create(activities)
            
            return Response(
                {'msg': f'Successfully saved {len(item_ids)} outfit(s)'}, 
                status=201
            )
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    

class UserRecentActivitiesView(ListAPIView):
    serializer_class = RecentActivitySerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return RecentActivity.objects.filter(user_id=user_id).select_related('item').order_by('-saved_at')