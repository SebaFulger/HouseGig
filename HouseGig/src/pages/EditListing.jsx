import './Explore.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, TextInput, Textarea, Button, FileInput, Group, Loader } from '@mantine/core';
import { IconUpload, IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api } from '../services/api';

function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    region: '',
    property_type: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const listing = await api.getListing(id);
        setFormData({
          title: listing.title || '',
          description: listing.description || '',
          region: listing.region || '',
          property_type: listing.property_type || ''
        });
      } catch (error) {
        console.error('Failed to load listing:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load design',
          color: 'red',
          icon: <IconX size={18} />
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    
    loadListing();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title) {
      notifications.show({
        title: 'Missing Information',
        message: 'Please fill in all required fields (title)',
        color: 'red',
        icon: <IconX size={18} />
      });
      return;
    }

    setSaving(true);
    
    try {
      let mainImageUrl = undefined;
      let galleryImageUrls = undefined;
      
      // Upload main image if a new one is provided
      if (mainImage) {
        const mainResponse = await api.uploadImage(mainImage);
        mainImageUrl = mainResponse.url;
      }
      
      // Upload gallery images if new ones are provided
      if (galleryImages && galleryImages.length > 0) {
        galleryImageUrls = await api.uploadImages(Array.isArray(galleryImages) ? galleryImages : [galleryImages]);
      }
      
      const listingData = {
        title: formData.title,
        description: formData.description,
        region: formData.region || null,
        property_type: formData.property_type || null
      };

      // Only include image URLs if new images were uploaded
      if (mainImageUrl !== undefined) {
        listingData.main_image_url = mainImageUrl;
      }
      if (galleryImageUrls !== undefined) {
        listingData.gallery_image_urls = galleryImageUrls;
      }
      
      await api.updateListing(id, listingData);
      
      notifications.show({
        title: 'Success',
        message: 'Your design has been updated',
        color: 'green',
        icon: <IconCheck size={18} />
      });
      
      navigate(`/listing/${id}`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message || 'Failed to update design. Please try again.',
        color: 'red',
        icon: <IconX size={18} />
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="explore-main">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader size="xl" type="dots" color="rgba(31, 96, 3, 0.8)" />
        </div>
      </main>
    );
  }

  return (
    <main className="explore-main">
      <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: '4.2rem', marginBottom: '3.5rem' }}>Edit Design</h2>
      
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <FileInput
            label="Main Image (Optional)"
            placeholder="Upload new main image (leave empty to keep current)"
            accept="image/*"
            value={mainImage}
            onChange={setMainImage}
            leftSection={<IconUpload size={18} />}
            mb="md"
            description="Upload a new main image to replace the current one"
          />
          
          <FileInput
            label="Gallery Images (Optional)"
            placeholder="Upload new gallery images (leave empty to keep current)"
            multiple
            accept="image/*"
            value={galleryImages}
            onChange={setGalleryImages}
            leftSection={<IconUpload size={18} />}
            mb="md"
            description="Upload new gallery images to replace the current ones"
          />

          <TextInput
            label="Title"
            placeholder="Beautiful modern apartment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            mb="md"
          />

          <Textarea
            label="Description"
            placeholder="Describe your property..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={4}
            mb="md"
          />

          <Group grow mb="md">
            <TextInput
              label="Property Type"
              placeholder="e.g. House, Garden"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            />

            <TextInput
              label="Region/Style"
              placeholder="e.g. Spain, Eisengard, Narnia"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />
          </Group>

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => navigate(`/listing/${id}`)} style={{ borderColor: 'rgba(31, 96, 3, 0.8)', color: 'rgba(31, 96, 3, 0.8)' }}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} leftSection={<IconCheck size={18} />} style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
              Update Design
            </Button>
          </Group>
        </form>
      </Paper>

    </main>
  );
}

export default EditListing;
