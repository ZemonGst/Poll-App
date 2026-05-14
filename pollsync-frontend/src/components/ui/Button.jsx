
export default function Button({ 
  variant = 'brand', 
  size = 'md', 
  loading = false, 
  icon, 
  onClick, 
  children, 
  disabled, 
  type = 'button',
  className = '' 
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-hanken-grotesk font-medium rounded-lg transition-all duration-200 focus:outline-none';
  
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const variantClasses = {
    primary: 'bg-[#e85d8a] text-white shadow-[0_0_15px_rgba(232,93,138,0.4)] hover:shadow-[0_0_20px_rgba(232,93,138,0.6)] hover:brightness-110 border border-transparent',
    brand: 'bg-primary text-on-primary shadow-[0_0_15px_rgba(218,194,175,0.3)] hover:bg-primary-fixed border border-transparent',
    ghost: 'bg-surface-container-high text-on-surface border border-outline-variant/30 hover:bg-surface-bright shadow-sm',
    danger: 'bg-error-container text-error hover:brightness-90 border border-transparent',
  };

  const stateClasses = (disabled || loading) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${className}`}
    >
      {loading && (
        <span className="material-symbols-outlined animate-spin text-[1.2em]">progress_activity</span>
      )}
      {!loading && icon && (
        <span className="material-symbols-outlined text-[1.2em]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      )}
      {children}
    </button>
  );
}
