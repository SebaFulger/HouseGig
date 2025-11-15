import './Explore.css';
import Footer from '../Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, TextInput, Textarea, NumberInput, Select, Button, FileInput, Group } from '@mantine/core';
import { IconUpload, IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    world: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    location: ''
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.price || !formData.world || images.length === 0) {
      notifications.show({
        title: 'Missing Information',
        message: 'Please fill in all required fields and upload at least one image',
        color: 'red',
        icon: <IconX size={18} />
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Upload images and create listing via API
      // const imageUrls = await api.uploadImages(images);
      // await api.createListing({ ...formData, images: imageUrls });
      console.log('Creating listing:', formData, images);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Success!',
        message: 'Your listing has been created',
        color: 'green',
        icon: <IconCheck size={18} />
      });
      
      navigate('/profile');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create listing. Please try again.',
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
            label="Images"
            placeholder="Upload property images"
            multiple
            accept="image/*"
            value={images}
            onChange={setImages}
            leftSection={<IconUpload size={18} />}
            required
            mb="md"
            description="Upload multiple images of your property"
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
            <NumberInput
              label="Price (§)"
              placeholder="1000000"
              value={formData.price}
              onChange={(value) => setFormData({ ...formData, price: value })}
              min={0}
              required
              thousandSeparator=","
            />

            <Select
              label="World"
              placeholder="Select world"
              value={formData.world}
              onChange={(value) => setFormData({ ...formData, world: value })}
              data={[
                { value: 'Skyblock', label: 'Skyblock' },
                { value: 'Survival', label: 'Survival' },
                { value: 'Creative', label: 'Creative' },
                { value: 'Oneblock', label: 'Oneblock' }
              ]}
              required
            />
          </Group>

          <Group grow mb="md">
            <Select
              label="Property Type"
              placeholder="Select type"
              value={formData.property_type}
              onChange={(value) => setFormData({ ...formData, property_type: value })}
              data={[
                { value: 'House', label: 'House' },
                { value: 'Apartment', label: 'Apartment' },
                { value: 'Villa', label: 'Villa' },
                { value: 'Castle', label: 'Castle' },
                { value: 'Modern', label: 'Modern' },
                { value: 'Traditional', label: 'Traditional' }
              ]}
            />

            <TextInput
              label="Location"
              placeholder="e.g. Downtown, Near spawn"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Group>

          <Group grow mb="xl">
            <NumberInput
              label="Bedrooms"
              placeholder="3"
              value={formData.bedrooms}
              onChange={(value) => setFormData({ ...formData, bedrooms: value })}
              min={0}
            />

            <NumberInput
              label="Bathrooms"
              placeholder="2"
              value={formData.bathrooms}
              onChange={(value) => setFormData({ ...formData, bathrooms: value })}
              min={0}
            />
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
