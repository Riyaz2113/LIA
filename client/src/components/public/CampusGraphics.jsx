/**
 * CampusGraphics
 * Real campus photograph components for Vignan's Lara Institute of Technology & Science.
 * Uses the authentic campus assets from /assets/campus/.
 */

/**
 * HeroCampusImage
 * Real campus photograph for the Home Hero section.
 * File: /assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png
 */
export const HeroCampusImage = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        backgroundColor: '#e2e8f0',
        aspectRatio: '16 / 9',
      }}
    >
      <img
        src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png"
        alt="Vignan's Lara Institute of Technology & Science - Engineering Excellence Campus Building"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
};

/**
 * AboutCampusImage
 * Real campus photograph for the Home About section.
 * File: /assets/campus/ChatGPT Image Sep 19, 2026, 08_59_11 PM.png
 */
export const AboutCampusImage = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        backgroundColor: '#e2e8f0',
        aspectRatio: '16 / 10',
      }}
    >
      <img
        src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_59_11 PM.png"
        alt="Vignan's Lara Institute of Technology & Science Campus Stage and Building"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Floating Badge on Bottom Right: "Empowering Minds for a Better Tomorrow" */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#0a1931',
          color: '#ffffff',
          padding: '0.625rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 8px 20px rgba(11, 26, 56, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxWidth: '240px',
          textAlign: 'center',
        }}
      >
        <span
          className="cursive-slogan-card"
          style={{
            display: 'block',
            fontSize: '1.25rem',
            lineHeight: 1.2,
            color: '#ffffff',
          }}
        >
          &ldquo;Empowering Minds for a Better Tomorrow&rdquo;
        </span>
      </div>
    </div>
  );
};
