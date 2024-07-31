import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import OutlinedAlerts from '../components/Alert';
import { ResponsiveAppBar } from "../components/Navbar";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Avatar,
    FormControl,
    Grid,
    Chip
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';

export default function Profile() {
    const token = localStorage.getItem('token');
    const [alert, setAlert] = useState(null); // 初始状态设置为null
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        company: '',
        bio: '',
        role: '',
        avatar: '',
        is_staff: false
    });
    const [initialProfileData, setInitialProfileData] = useState({
        username: '',
        email: '',
        company: '',
        bio: '',
        role: '',
        avatar: '',
        is_staff: false
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setProfileData(initialProfileData);
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        handleSaveData();
        setIsEditing(false);
    };

    const handleFormSubmit = (event) => {
        // 阻止自动刷新
        event.preventDefault();
        // 处理表单提交逻辑
        // setIsEditing(false);
    };

    const fetchProfileData = useCallback(() => {
        axios.get('http://127.0.0.1:8000/invoice/user-info/', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            setProfileData(response.data);
            setInitialProfileData(response.data);
        })
        .catch(error => {
            console.log(error.message);
            setAlert({ severity: 'error', message: error.message });
        });
    }, [token]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    useEffect(() => {
        console.log('Updated profileData:', profileData);
    }, [profileData]);

    const handleSaveData = () => {
      const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        formData.append('name', profileData.name);
        formData.append('bio', profileData.bio);
        // formData.append('is_staff', profileData.is_staff);
        if (profileData.avatarFile) {
            formData.append('avatar', profileData.avatarFile);
        }
        axios.post(`http://127.0.0.1:8000/invoice/user-info/`,
          formData, { 
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data);
            console.log(profileData);
            setAlert({ severity: 'success', message: 'Profile updated successfully' });
        })
        .catch(error => {
            if (error.response) {
                setAlert({ severity: 'error', message: 'Profile updated fail'});
                console.log(profileData);
            } else {
                setAlert({ severity: 'error', message: error.message });
                console.log(error.message);
                console.log(profileData);
            }
        });
    };
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
          setProfileData({ ...profileData, avatarFile: file });
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfileData({ ...profileData, avatar: reader.result });
          };
          reader.readAsDataURL(file);
      }
  };

    return (
      <div>
      <ResponsiveAppBar />
      {alert && (
      <div style={{
          position: 'fixed',
          top: '11vh',
          right: 10,
          width: '30%',
          zIndex: 9999
      }}>
          <OutlinedAlerts severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
          </OutlinedAlerts>
      </div>
      )}
      <Container maxWidth="sm">
          <Box
              sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  mt: 5,
                  p: 3,
                  borderRadius: 1,
                  boxShadow: 3,
              }}
          >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}> 
                  Profile
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 3, marginLeft: '10px' }} onSubmit={handleFormSubmit}>
                  <Grid container spacing={2} alignItems="flex-start">
                          <div style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "flex-start",
                                  width: '100%'
                                }}
                                fullWidth> 
                            <div style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  marginRight: "auto",
                                   width: '100%',
                                   marginRight: '10px'
                                }}>
                              <Chip icon={<FaceIcon />} label={profileData.is_staff ? 'Admin' : 'User'} variant="outlined" sx={{ mr: 2 }} />
                              <Typography variant="h6">{profileData.name}</Typography>
                          
                            </div>
                            <div>
                              <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload"
                                type="file"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="avatar-upload">
                                <Avatar
                                    src={profileData.avatar || "https://via.placeholder.com/150"}
                                    sx={{ width: 50, height: 50,  cursor: isEditing ? 'pointer' : 'default' }}
                                    component={isEditing ? 'span' : 'div'}
                                />
                            </label>
                            </div>
                          </div>
                          
                      {/* </Grid> */}
                      <Grid item xs={12}>
                          <FormControl fullWidth>
                              {isEditing ? (
                                  <TextField
                                      disabled
                                      id="profile-role"
                                      label="Role"
                                      value={profileData.is_staff ? 'Admin' : 'User'}
                                  />
                              ) : (
                                  <Box>
                                      <Typography variant="body1" component="label" htmlFor="role" style={{ fontWeight: 'bold', display: 'block' }}>Role</Typography>
                                      <Typography variant="body1" id="role" style={{ padding: '6px 0' }}>{profileData.is_staff ? 'Admin' : 'User'}</Typography>
                                  </Box>
                              )}
                          </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                          {isEditing ? (
                              <TextField
                                  fullWidth
                                  id="profile-username"
                                  label="Username"
                                  name="username"
                                  value={profileData.username}
                                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                              />
                          ) : (
                              <Box>
                                  <Typography variant="body1" component="label" htmlFor="username" style={{ fontWeight: 'bold', display: 'block' }}>Username</Typography>
                                  <Typography variant="body1" id="username" style={{ padding: '6px 0' }}>{profileData.username}</Typography>
                              </Box>
                          )}
                      </Grid>
                      <Grid item xs={12}>
                          {isEditing ? (
                              <TextField
                                  fullWidth
                                  id="profile-email"
                                  label="Email"
                                  name="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              />
                          ) : (
                              <Box>
                                  <Typography variant="body1" component="label" htmlFor="email" style={{ fontWeight: 'bold', display: 'block' }}>Email</Typography>
                                  <Typography variant="body1" id="email" style={{ padding: '6px 0' }}>{profileData.email}</Typography>
                              </Box>
                          )}
                      </Grid>
                      <Grid item xs={12}>
                          {isEditing ? (
                              <TextField
                                  fullWidth
                                  name="company"
                                  label="Company"
                                  id="profile-company"
                                  value={profileData.company}
                                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                              />
                          ) : (
                              <Box>
                                  <Typography variant="body1" component="label" htmlFor="company" style={{ fontWeight: 'bold', display: 'block' }}>Company</Typography>
                                  <Typography variant="body1" id="company" style={{ padding: '6px 0' }}>{profileData.company}</Typography>
                              </Box>
                          )}
                      </Grid>
                      <Grid item xs={12}>
                          {isEditing ? (
                              <TextField
                                  fullWidth
                                  id="profile-bio"
                                  label="Bio"
                                  name="bio"
                                  value={profileData.bio}
                                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                  multiline
                                  rows={4}
                              />
                          ) : (
                              <Box>
                                  <Typography variant="body1" component="label" htmlFor="bio" style={{ fontWeight: 'bold', display: 'block' }}>Bio</Typography>
                                  <Typography variant="body1" id="bio" style={{ padding: '6px 0' }}>{profileData.bio}</Typography>
                              </Box>
                          )}
                      </Grid>
                  </Grid>
                  {isEditing ? (
                      <div style={{
                          display: "flex",
                          marginTop: "10px",
                          justifyContent: "space-between",
                      }}>
                          <Button
                              type="button"
                              variant="contained"
                              onClick={handleCancelClick}
                              sx={{ backgroundColor: "#263238", color: "white" }}
                          >
                              Cancel
                          </Button>
                          <Button
                              type="submit"
                              variant="contained"
                              sx={{ backgroundColor: "#263238", color: "white" }}
                              onClick={handleSaveClick}
                          >
                              Save changes
                          </Button>
                      </div>
                  ) : (
                      <Button
                          fullWidth
                          variant="contained"
                          sx={{ backgroundColor: "#263238", color: "white", marginTop: '20px' }}
                          onClick={handleEditClick}
                      >
                          Edit Profile
                      </Button>
                  )}
              </Box>
          </Box>
      </Container>
  </div>
    );
}
