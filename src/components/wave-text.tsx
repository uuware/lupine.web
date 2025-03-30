export type TextLoadingProps = {
  text: string;
};
export const WaveText = (props: TextLoadingProps) => {
  const cssMap: any = {};
  props.text.split('').forEach((char, index) => {
    cssMap[`.span${index}`] = { animationDelay: `${index * 0.1}s` };
  });
  const css: any = {
    width: `100%`,
    height: `100%`,
    padding: '10px',
    textAlign: 'center',
    fontSize: '20px',
    color: '#22b8ff',
    textShadow: '1px -1px #ffffff, -2px 2px #999, -6px 7px 3px #131f5be6',
    '.text-loading.wave-animetion span': {
      display: 'inline-block',
      padding: '0 4px',
      animation: 'wave-text 1s ease-in-out infinite',
    },
    '.text-loading.wave-animetion': {
      marginTop: '0.6em',
      ...cssMap,
    },
    '@keyframes wave-text': {
      '0%': {
        transform: 'translateY(0em)',
      },
      '60%': {
        transform: 'translateY(-0.6em)',
      },
      '100%': {
        transform: 'translateY(0em)',
      },
    },
  };
  return (
    <div css={css} class='text-loading-top'>
      <div class='text-loading wave-animetion'>
        {props.text.split('').map((char, index) => (
          <span class={`span${index}`}>{char}</span>
        ))}
      </div>
    </div>
  );
};
