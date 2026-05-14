import DarkModeContainer from '@/components/DarkModeContainer';

const GlobalFooter = () => {
  return (
    <DarkModeContainer className="h-full flex-center">
      <a
        href="https://github.com/pzhdv/skyroc-admin-react"
        rel="noopener noreferrer"
        target="_blank"
      >
        Copyright MIT © 2025 skyroc-admin-react
      </a>
    </DarkModeContainer>
  );
};

export default GlobalFooter;
