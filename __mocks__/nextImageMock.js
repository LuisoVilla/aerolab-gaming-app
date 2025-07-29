import NextImage from 'next/image';

export default function Image(props) {
  // Ensure alt prop is always present
  const { alt = '', ...rest } = props;
  return <NextImage alt={alt} {...rest} />;
}
