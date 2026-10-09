import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInView } from '@/hooks/useInView';
import { Reveal } from '@/components/common/Reveal';

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IOCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IOCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  static last() {
    return MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];
  }
}

const originalIntersectionObserver = globalThis.IntersectionObserver;

function Probe() {
  const { ref, visible } = useInView<HTMLDivElement>();
  return <div ref={ref} data-testid="target" data-visible={String(visible)} />;
}

describe('useInView', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('empieza oculto y se marca visible al entrar en el viewport', () => {
    render(<Probe />);

    expect(screen.getByTestId('target')).toHaveAttribute('data-visible', 'false');

    act(() => {
      MockIntersectionObserver.last().callback([{ isIntersecting: true }]);
    });

    expect(screen.getByTestId('target')).toHaveAttribute('data-visible', 'true');
  });

  it('se desconecta del observer al hacerse visible', () => {
    render(<Probe />);
    const observer = MockIntersectionObserver.last();

    act(() => {
      observer.callback([{ isIntersecting: true }]);
    });

    expect(observer.disconnect).toHaveBeenCalled();
    expect(observer.observe).toHaveBeenCalled();
  });

  it('queda visible si IntersectionObserver no existe (jsdom/tests)', () => {
    // @ts-expect-error — se elimina para simular el entorno sin soporte
    delete globalThis.IntersectionObserver;

    render(<Probe />);

    expect(screen.getByTestId('target')).toHaveAttribute('data-visible', 'true');
  });
});

describe('Reveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('renderiza el elemento pedido con las clases de reveal', () => {
    render(
      <Reveal as="header" className="mb-8" delay={2}>
        <h1>Título</h1>
      </Reveal>,
    );

    const wrapper = screen.getByText('Título').parentElement;
    expect(wrapper?.tagName).toBe('HEADER');
    expect(wrapper).toHaveClass('reveal', 'reveal-delay-2', 'mb-8');
    expect(wrapper).not.toHaveClass('reveal-visible');
  });

  it('agrega reveal-visible cuando entra en el viewport', () => {
    render(
      <Reveal>
        <h1>Título</h1>
      </Reveal>,
    );

    act(() => {
      MockIntersectionObserver.last().callback([{ isIntersecting: true }]);
    });

    expect(screen.getByText('Título').parentElement).toHaveClass('reveal-visible');
  });
});
