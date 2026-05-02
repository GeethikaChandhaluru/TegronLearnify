import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { buyNow } from '../services/api';
import toast from 'react-hot-toast';
import { getFileUrl } from '../utils/urlHelper';

export default function BookCard({ book, delay = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    try {
      await buyNow(book._id);
      toast.success('Purchase successful! Check My Books.');
      navigate('/purchased');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(book._id);
  };

  return (
    <div
      className="book-card"
      style={{ animationDelay: `${delay}ms`, cursor: 'pointer' }}
      onClick={() => navigate(`/books/${book._id}`)}
    >
      <div style={{ position: 'relative' }}>
        {book.thumbnail ? (
          <img
            src={getFileUrl(book.thumbnail)}
            alt={book.title}
            className="book-card-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="book-card-img-placeholder">
            <div className="book-icon">📖</div>
            <span>BOOK</span>
          </div>
        )}
        {book.category && (
          <span className="book-card-category">{book.category}</span>
        )}
      </div>

      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>
        <p className="book-card-desc">{book.description}</p>
        <div className="book-card-price">
          {book.price === 0
            ? <span className="free">FREE</span>
            : `₹${book.price.toFixed(2)}`}
        </div>
        <div className="book-card-actions">
          <button
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '10px 12px' }}
            onClick={handleAddToCart}
          >
            🛒 Cart
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '10px 12px' }}
            onClick={handleBuyNow}
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </div>
  );
}
