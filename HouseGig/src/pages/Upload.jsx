import './Explore.css';
import Footer from '../Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, TextInput, Textarea, NumberInput, Select, Button, FileInput, Group, Slider } from '@mantine/core';
import { IconUpload, IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api } from '../services/api';

function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    
    try {
      let mainImageUrl = null;
      let galleryImageUrls = [];
      
      // Upload main image if provided
      if (mainImage) {
        const mainResponse = await api.uploadImage(mainImage);
        mainImageUrl = mainResponse.url;
      }
      
      // Upload gallery images if provided
      if (galleryImages && galleryImages.length > 0) {
        console.log('Gallery images:', galleryImages, 'Type:', Array.isArray(galleryImages));
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
        main_image_url: mainImageUrl,
        gallery_image_urls: galleryImageUrls,
        tags: []
      };
      
      await api.createListing(listingData);
      
      notifications.show({
        title: 'Success!',
        message: 'Your listing has been created',
        color: 'green',
        icon: <IconCheck size={18} />
      });
      
      navigate('/profile');
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message || 'Failed to create listing. Please try again.',
        color: 'red',
        icon: <IconX size={18} />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="explore-main">
      <h2 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: '4.2rem', marginBottom: '3.5rem' }}>Create New Listing</h2>
      
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <FileInput
            label="Main Image (Optional)"
            placeholder="Upload main property image"
            accept="image/*"
            value={mainImage}
            onChange={setMainImage}
            leftSection={<IconUpload size={18} />}
            mb="md"
            description="Upload a main image for your listing"
          />
          
          <FileInput
            label="Gallery Images (Optional)"
            placeholder="Upload additional images"
            multiple
            accept="image/*"
            value={galleryImages}
            onChange={setGalleryImages}
            leftSection={<IconUpload size={18} />}
            mb="md"
            description="Upload up to 10 additional images"
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
              label="World"
              placeholder="e.g. Earth, Venus, Krypton"
              value={formData.world}
              onChange={(e) => setFormData({ ...formData, world: e.target.value })}
              required
            />
          </Group>

          <Group grow mb="md">
            <TextInput
              label="Property Type"
              placeholder="e.g. House, Apartment, Villa, Castle"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            />

            <TextInput
              label="Region"
              placeholder="e.g. Spain, Eisengard, Narnia"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />
          </Group>

          <Group grow mb="xl" align="flex-start">
            <Select
              label="Rarity"
              placeholder="Select rarity"
              value={formData.rarity}
              onChange={(value) => setFormData({ ...formData, rarity: value })}
              data={[
                { value: 'Common', label: 'Common' },
                { value: 'Uncommon', label: 'Uncommon' },
                { value: 'Rare', label: 'Rare' },
                { value: 'Epic', label: 'Epic' },
                { value: 'Legendary', label: 'Legendary' }
              ]}
            />

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                Magic Level: {formData.magic_level}
              </label>
              <Slider
                value={formData.magic_level}
                onChange={(value) => setFormData({ ...formData, magic_level: value })}
                min={1}
                max={10}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' }
                ]}
                color="rgba(31, 96, 3, 0.8)"
              />
            </div>
          </Group>

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => navigate(-1)} style={{ borderColor: 'rgba(31, 96, 3, 0.8)', color: 'rgba(31, 96, 3, 0.8)' }}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} leftSection={<IconCheck size={18} />} style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)' }}>
              Create Listing
            </Button>
          </Group>
        </form>
      </Paper>
      <Footer />
    </main>
  );
}

export default Upload;
