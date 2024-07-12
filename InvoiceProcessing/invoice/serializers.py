from rest_framework import serializers,exceptions
from .models import Company, User, UpFile, GUIFile
import json
import os

class InvoiceUpfileSerializer(serializers.ModelSerializer):
    supplier = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    creation_method = serializers.SerializerMethodField()
    class Meta:
        model = UpFile
        fields = ['id', 'timestamp', 'userid', 'uuid', 'file','supplier',"total","state","creation_method"]
        
    def get_file_data(self, obj):
        file_name = os.path.basename(str(obj.file))
        file_stem = os.path.splitext(file_name)[0]
        try:
            with open(f"staticfiles/{obj.userid.id}/{file_stem}.json", 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def get_supplier(self, obj):
        data = self.get_file_data(obj)
        return data.get('supplier_name', 'N/A')
    
    def get_total(self, obj):
        data = self.get_file_data(obj)
        return data.get('total', 'N/A')
    def get_state(self, obj):
        if not obj.is_validated:
            return "unvalidated"
        if obj.is_validated and not obj.is_correct:
            return "Failed"
        if obj.is_validated and obj.is_correct:
            return "Passed"
        return "Unknown"  # 如果有其他状态可以添加此行作为默认值

    def get_creation_method(self, obj):
        if GUIFile.objects.filter(userid=obj.userid, uuid=obj.uuid).exists():
            return "gui"
        return "upload"
    
class CompanySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Company
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    # company = serializers.ReadOnlyField(source='company.name') # 外键字段 只读
    
    class Meta:
        model = User
        fields = ['username','password','name','email',"confirm_password"]
        extra_kwargs = {
            "id": {"read_only": True,},
            'password': {'write_only': True},
        }
        
        
        """
        自定义验证方法 validate_<field_name> 会在调用 is_valid() 方法时自动被调用。
        """
    def validate_password(self, value):
        return value
    
    """
    value：在 validate_confirm_password 方法中value 是用户输入的 confirm_password 字段的值。
    因为这个方法的命名规则是 validate_<field_name>，DRF 会自动将 confirm_password 字段的值传递给 validate_confirm_password 方法。
    """
    def validate_confirm_password(self, value):
        password = self.initial_data.get('password')
        if value != password:
            raise exceptions.ValidationError("Passwords do not match")
        return value
    

    
class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    
    
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'




# only data of uploading files need to be serialized
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpFile
        fields = ['file','uuid']
"""    def create(self, validated_data):
        # Set is_validated to True when creating a new UpFile instance
        validated_data['is_validated'] = True
        return super().create(validated_data)"""
        
class FileGUISerializer(serializers.ModelSerializer):
    filename = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)
    userid = serializers.PrimaryKeyRelatedField(read_only=True)  # 设置为只读
    class Meta:
        model = GUIFile
        fields = '__all__'

class FileDeletionSerializer(serializers.Serializer):
    file_name = serializers.CharField(required=True)
    uuid = serializers.CharField(required=True)