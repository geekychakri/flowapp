export const fadeInUp = {
  initial: {
    y: 30,
    opacity: 0,
  },

  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export const slideIn = {
  initial: {
    x: -60,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};
