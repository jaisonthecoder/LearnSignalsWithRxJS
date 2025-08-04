import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation">
      <div class="nav-container">
        <div class="logo">
          <h2>RxJS vs Signals</h2>
          <span class="tagline">Learning Dashboard</span>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            📊 Dashboard
          </a>
          <a routerLink="/rxjs-base" routerLinkActive="active" class="nav-link">
            🔄 RxJS Demo
          </a>
          <a routerLink="/rxjs-operators" routerLinkActive="active" class="nav-link">
            ⚙️ RxJS Operators
          </a>
          <a routerLink="/signals" routerLinkActive="active" class="nav-link">
            📡 Signals Demo
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navigation {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .tagline {
      font-size: 0.9rem;
      opacity: 0.8;
      font-weight: 300;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      font-weight: 500;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
        padding: 0 1rem;
      }

      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }

      .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class NavigationComponent {}
