import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../component/ProfileCard.jsx";
import { useAuth } from "../../context/authContext.jsx";
import { getProfileByUserId } from "../../api/userProfileApi.js";
import "./Home.css";
import PageHeader from "../../component/PageHeader.jsx";
import { FaHome } from "react-icons/fa";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import Alert from "../../component/Alert.jsx";
import { useLocation } from "react-router-dom";
import Loading from "../../component/Loading.jsx";
const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alert, setAlert] = useState(location.state?.alert || null);
  const { user, profileUpdated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const token = localStorage.getItem("token");
const featureImages = [
    {
      title: "🥗 Personalized Diet Plans",
      description:
        "AI-generated meal plans based on your goals and preferences",
      url: "https://res.cloudinary.com/dswdcfif6/image/upload/v1769590168/meal-plan_nxbnzu.jpg",
      link: "/dietplan",
      type: "diet-card",
    },
    {
      title: "💪 Custom Workouts",
      description:
        "Tailored exercise routines for your fitness level and equipment",
      url: "https://res.cloudinary.com/dswdcfif6/image/upload/v1769590993/workout-image_2_v1xf5i.jpg",
      link: "/workouts",
      type: "workout-cards",
    },
    {
      title: "📊 Progress Tracking",
      description: "Monitor your journey with detailed analytics and insights",
      url: "https://res.cloudinary.com/dswdcfif6/image/upload/v1769590168/progress_j2hgpd.jpg",
      link: "/dailyprogress",
      type: "progress-cards",
    },
  ];
  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      // clear it so it doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getProfileByUserId();
        console.log("Fetched profile data in Home:", data);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile in Home:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);
  if (loading) {return <Loading text="Loading Home Page..." />};
  return (
    <main className="home">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          autoClose={alert.autoClose}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-row">
            <PageHeader
              icon={<FaHome />}
              title={`Welcome${user ? `, ${user.username}` : ""} to Your AI Diet Fitness Planner`}
              subtitle="Your personalized health and fitness assistant powered by AI"
            />

            {!loading && (
              <button
                className="primary-btn hero-btn"
                onClick={() => setShowProfileCard(true)}
              >
                {profile ? (
                  <>
                    <FaEdit />
                    Edit Your Profile Here
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Get Started Here
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {featureImages.map((feature, index) => (
          <div
            key={index}
            className={`feature-card ${feature.type}`}
            onClick={() => navigate(feature.link)}
          >
            <div className="feature-text">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
            <div className="feature-image-wrap">
              <img src={feature.url} alt={feature.title} loading="lazy" />
            </div>
          </div>
        ))}
      </section>

      {/* Profile Modal */}
      {showProfileCard && (
        <ProfileCard
          onClose={() => setShowProfileCard(false)}
          edit={!!profile}
        />
      )}
    </main>
  );
};

export default Home;
