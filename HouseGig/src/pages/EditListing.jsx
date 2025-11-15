import './Explore.css';
import Footer from '../Footer';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Title, TextInput, Textarea, NumberInput, Select, Button, FileInput, Group, Slider, Loader } from '@mantine/core';
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
    price: '',
    world: '',
    region: '',
    property_type: '',
    rarity: '',
    magic_level: 1
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
          price: listing.price || '',
          world: listing.world || '',
          region: listing.region || '',
          property_type: listing.property_type || '',
          rarity: listing.rarity || '',
          magic_level: listing.magic_level || 1
        });
      } catch (error) {
        console.error('Failed to load listing:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load listing',
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
    if (!formData.title || !formData.price || !formData.world) {
      notifications.show({
        title: 'Missing Information',
        message: 'Please fill in all required fields',
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
        price: formData.price,
        world: formData.world,
        region: formData.region || null,
        property_type: formData.property_type || null,
        rarity: formData.rarity || null,
        magic_level: formData.magic_level || null,
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
        title: 'Success!',
        message: 'Your listing has been updated',
        color: 'green',
        icon: <IconCheck size={18} />
      });
      
      navigate(`/listing/${id}`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message || 'Failed to update listing. Please try again.',
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
          <Loader size="xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="explore-main">
      <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: '4.2rem', marginBottom: '3.5rem' }}>Edit Listing</h2>
      
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
              label="Price"
              placeholder="e.g. 1000000 coins, 500 diamonds"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <TextInput
              label="World/Server"
              placeholder="e.g. Skyblock, Creative"
              value={formData.world}
              onChange={(e) => setFormData({ ...formData, world: e.target.value })}
              required
            />
          </Group>

          <Group grow mb="md">
            <TextInput
              label="Region"
              placeholder="e.g. Spawn, Nether"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />

            <TextInput
              label="Property Type"
              placeholder="e.g. House, Castle, Farm"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            />
          </Group>

          <Group grow mb="md">
            <TextInput
              label="Rarity"
              placeholder="e.g. Common, Rare, Legendary"
              value={formData.rarity}
              onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
            />

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                Magic Level: {formData.magic_level}
              </label>
              <Slider
                value={formData.magic_level}
                onChange={(value) => setFormData({ ...formData, magic_level: value })}
                min={1}
                max={10}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
              />
            </div>
          </Group>

          <Group mt="xl">
            <Button 
              type="submit" 
              size="md" 
              loading={saving}
              leftSection={<IconCheck size={18} />}
            >
              Update Listing
            </Button>
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => navigate(`/listing/${id}`)}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Paper>

      <Footer />
    </main>
  );
}

export default EditListing;
