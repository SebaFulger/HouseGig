import './Explore.css';
import listings from '../dummyListings';
import ListingCard from '../components/ListingCard';
import { Link } from 'react-router-dom';
import { Grid, GridCol } from '@mantine/core';

function Explore() {
  return (
    <main className="explore-main">
      <h2 className="explore-title">Explore Listings</h2>
      <div className="grid-container">
        <Grid gutter={32}>
          {listings.map(listing => (
            <GridCol key={listing.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListingCard listing={listing} />
              </Link>
            </GridCol>
          ))}
        </Grid>
      </div>
    </main>
  );
}

export default Explore;
