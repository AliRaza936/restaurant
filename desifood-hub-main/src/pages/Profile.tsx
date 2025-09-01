import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, Mail, MapPin, Save, Edit3, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";


import { fetchUserById, updateProfile } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Get user from Redux
  const userData = useSelector((state: RootState) => state.auth.userData?.user);
  console.log(userData)

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: ""
  });

  // Fetch user ID from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Fetch user from backend when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, [dispatch, user?.id]);


  // Update formData when userData changes
useEffect(() => {
  if (userData) {
    setFormData({
      fullName: userData.full_name || "",
      email: userData.email || "",
      address: userData.address || "",
      city: userData.city || "",
      postalCode: userData.postal_code || ""
    });
  }
}, [userData]);
useEffect(()=>{
  window.scrollTo(0,0)
},[])



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const result = await dispatch(updateProfile({
        id: user.id,
        profileData: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        }
      })).unwrap();

      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully!",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
  if (userData) {
    setFormData({
      fullName: userData.full_name || "",
      email: userData.email || "",
      address: userData.address || "",
      city: userData.city || "",
      postalCode: userData.postal_code || ""
    });
  }
  setIsEditing(false);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 ">
      <div className=" mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Profile Information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData?.email}
                  disabled
                  className="bg-red-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Postal Code
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
        <Footer />
    </div>
  );
}
