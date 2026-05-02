import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar   from '../../components/Navbar';
import Loader   from '../../components/Loader';
import { useCart } from '../../context/CartContext';
import { getBook, buyNow } from '../../services/api';
import toast from 'react-hot-toast';
import { getFileUrl } from '../../utils/urlHelper';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [buying, setBuying]     = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getBook(id)
      .then(({ data }) => setBook(data.data))
      .catch(() => { toast.error('Book not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      await buyNow(book._id);
      setShowSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!book)   return null;

  return (
    <>
      <Navbar />

      {/* Order Confirmed Success Modal */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">🎉</div>
            <h3>Order Confirmed!</h3>
            <p>
              <strong>{book.title}</strong> has been added to your library.
              Head to <em>My Books</em> to start reading.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => navigate('/')}>
                Browse More
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/purchased')}>
                📚 Go to My Books
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-wrap section">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--cyan)', fontWeight: 500 }}
            onClick={() => navigate('/')}>Home</span>
          {' / '}{book.title}
        </div>

        <div className="book-detail-layout animate-fade-up">
          {/* Cover */}
          <div>
            {book.thumbnail ? (
              <img src={getFileUrl(book.thumbnail)} alt={book.title} className="book-detail-img" />
            ) : (
              <div className="book-detail-img" style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)',
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '12px' }}>📖</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Book Cover</div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="book-detail-info">
            {book.category && book.category !== 'General' && (
              <span className="book-detail-category">{book.category}</span>
            )}
            <h1 className="book-detail-title">{book.title}</h1>

            <div className="book-detail-price">
              {book.price === 0 ? <span style={{ color: '#16a34a' }}>FREE</span> : `₹${book.price.toFixed(2)}`}
            </div>

            <p className="book-detail-desc">{book.description}</p>

            {/* What you get */}
            <div style={{
              background: 'rgba(40,199,217,0.07)', border: '1.5px solid rgba(40,199,217,0.2)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '28px',
            }}>
              <p style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.87rem', marginBottom: 8 }}>
                ✅ After purchase you'll get:
              </p>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 2 }}>
                {book.pdfFile && <li>📄 Full PDF access in My Books</li>}
                {book.bookUrl && <li>🔗 Instant access via external link</li>}
                <li>📱 Read on any device, anytime</li>
              </ul>
            </div>

            <div className="book-detail-actions">
              <button className="btn btn-outline" onClick={() => addToCart(book._id)}>
                🛒 Add to Cart
              </button>
              <button className="btn btn-primary" onClick={handleBuyNow} disabled={buying}>
                {buying ? 'Processing…' : '⚡ Buy Now'}
              </button>
            </div>
          </div>
        </div>
        {/* NO PDF iframe here — PDF only accessible after purchase in My Books */}
      </div>
    </>
  );
}
