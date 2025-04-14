from rest_framework import serializers
from .models import UserAccount, CollectionItem, RecentActivity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    
    def create(self, validate_data):
        return UserAccount.objects.create_user(**validate_data)
    
    
class UserSerializer1(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = '__all__'
        
        

class CollectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionItem
        fields = '__all__'
        
        
class CollectionListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = CollectionItem
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
    
    
    

class RecentActivitySerializer(serializers.ModelSerializer):
    item = CollectionItemSerializer()
    class Meta:
        model = RecentActivity
        fields = '__all__'


class EditCollectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionItem
        fields = [
            'name', 'type',  'clothing_type', 
            'occasion', 'season', 'style', 'fabric', 'color_palette',
            'image'
        ]
        extra_kwargs = {
            'image': {'required': False},
            'name': {'required': False},
            'type': {'required': False},
            # Make all other fields optional as well
        }

    def to_internal_value(self, data):
        # Handle file upload separately
        ret = super().to_internal_value(data)
        file = data.get('image')
        
        if file and file != 'undefined':
            ret['image'] = file
        elif 'image' in ret:
            del ret['image']
            
        return ret