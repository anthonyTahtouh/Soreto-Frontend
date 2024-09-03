import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from '../components/Dashboard';
import Category from '../pages/category/Index';
import CategoryIndex from '../pages/categoryIndex/index';
import Brand from '../pages/brand/Index';
import DynamicRewardPool from '../pages/dynamicRewardPool/Index';
import Refresh from '../pages/refresh/Index';
import Wizard from '../pages/wizard/Index';
import Offer from '../pages/offer/Index';
import Notification from '../pages/notification/Index';
import OfferIndex from '../pages/offerIndex/Index';
import Banner from '../pages/banner/Index';
import Blog from '../pages/blog/Index';
import BlogIndex from '../pages/blogIndex';
import BrandIndex from '../pages/brandIndex';
import UserTrackingFlow from '../pages/usertrackingflow/Index';
import OrderPostReward from '../pages/orderpostreward/Index';
import BlogEdit from '../pages/blog/BlogEdit';
import Feeds from '../pages/feeds/Index';
import Tracking from '../pages/tracking/tabs/Tracking';
import FlashCampaign from '../pages/flashCampaign/Index';
import Asset from '../pages/assets/Edit';
import UsersAccess from '../pages/usersAccess/Index';
import AbTestReportClassic from '../pages/abTest/AbTestReportClassic';
import AbTest from '../pages/abTest/Index';
import AbTestEdit from '../pages/abTest/edit/Index';

const SoretoRoutes = ({
  colorMode,
  newThemeLoaded,
  setNewThemeLoaded,
}: any) => {
  return (
    <Routes>
      <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
        <Route
          path="/"
          element={
            <Dashboard
              colorMode={colorMode}
              isNewThemeLoaded={newThemeLoaded}
              onNewThemeChange={(e: any) => setNewThemeLoaded(e)}
            />
          }
        />
        <Route path="/marketplace/categories" element={<Category />} />
        <Route
          path="/marketplace/categoriesIndex"
          element={<CategoryIndex />}
        />
      </Route>
      <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
        <Route path="/marketplace/brands" element={<Brand />} />
        <Route
          path="/support/dynamicRewardPool"
          element={<DynamicRewardPool />}
        />
        <Route path="/marketplace/refresh" element={<Refresh />} />
        <Route path="/marketplace/offers" element={<Offer />} />
        <Route path="/marketplace/offersIndex" element={<OfferIndex />} />
        <Route path="/marketplace/notifications" element={<Notification />} />
        <Route path="/marketplace/banners" element={<Banner />} />
        <Route path="/marketplace/blogs" element={<Blog />} />
        <Route path="/marketplace/blogs/:blogId" element={<BlogEdit />} />
        <Route path="/marketplace/blogs/newBlog" element={<BlogEdit />} />
        <Route path="/marketplace/blogsIndex" element={<BlogIndex />} />
        <Route path="/marketplace/brandsIndex" element={<BrandIndex />} />
        <Route path="/marketplace/flashCampaign" element={<FlashCampaign />} />
        <Route path="/asset/:id" element={<Asset />} />
        <Route
          path="/support/usertrackingflow"
          element={<UserTrackingFlow />}
        />
        <Route path="/support/orderpostreward" element={<OrderPostReward />} />
        <Route path="/marketplace/operations/feeds" element={<Feeds />} />
        <Route path="/support/usersAccess" element={<UsersAccess />} />

        <Route
          path="/abTest/abTestReportClassic/:abTestId"
          element={<AbTestReportClassic />}
        />
      </Route>
      <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
        <Route path="/marketplace/wizard" element={<Wizard />} />
        <Route path="/abTest" element={<AbTest />} />
        <Route path="/abTest/:id" element={<AbTestEdit />} />
      </Route>
      <Route path="/statistics/tracking" element={<Tracking />} />

      <Route
        path="/unauthorized"
        element={
          <h1
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100vh',
              alignItems: 'center',
            }}
          >
            Unauthorized!
          </h1>
        }
      />
    </Routes>
  );
};

export default SoretoRoutes;
