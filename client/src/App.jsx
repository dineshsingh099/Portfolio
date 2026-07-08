import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";

import Navbar from "./portfolio/layout/Navbar";
import Footer from "./portfolio/layout/Footer";
import BackToTop from "./portfolio/layout/BackToTop";

import Hero from "./portfolio/home/Hero";
import CursorFX from "./effects/CursorFX";

import ProtectedRoute from "./admin/auth/ProtectedRoute";

import PortfolioSkeleton, {
	SectionsSkeleton,
} from "./effects/Skeleton";
import {
	AdminDashboardSkeleton,
	AuthCardSkeleton,
} from "./admin/dashboard/DashboardSkeleton";

import useReveal from "./hooks/useReveal";
import usePageTracking from "./hooks/usePageTracking";

const About = lazy(() => import("./portfolio/home/About"));
const Skills = lazy(() => import("./portfolio/home/Skills"));
const Timeline = lazy(() => import("./portfolio/home/Timeline"));
const Projects = lazy(() => import("./portfolio/home/Projects"));
const Certifications = lazy(() => import("./portfolio/home/Certifications"));
const Resume = lazy(() => import("./portfolio/home/Resume"));
const Contact = lazy(() => import("./portfolio/home/Contact"));

const AdminLoginPage = lazy(() => import("./admin/auth/AdminLoginPage"));
const ForgotPasswordPage = lazy(
	() => import("./admin/auth/ForgotPasswordPage"),
);
const AdminDashboard = lazy(() => import("./admin/dashboard/AdminDashboard"));

function setMeta(name, content, attr = "name") {
	if (!content) return;

	let element = document.querySelector(`meta[${attr}="${name}"]`);

	if (!element) {
		element = document.createElement("meta");
		element.setAttribute(attr, name);
		document.head.appendChild(element);
	}

	element.setAttribute("content", content);
}

function useSEO(seo) {
	useEffect(() => {
		if (!seo) return;

		if (seo.metaTitle) {
			document.title = seo.metaTitle;
		}

		setMeta("description", seo.metaDescription);

		if (seo.metaKeywords?.length) {
			setMeta("keywords", seo.metaKeywords.join(", "));
		}

		setMeta("og:title", seo.metaTitle, "property");
		setMeta("og:description", seo.metaDescription, "property");

		if (seo.ogImage) {
			setMeta("og:image", seo.ogImage, "property");
		}

		if (seo.googleSiteVerification) {
			setMeta("google-site-verification", seo.googleSiteVerification);
		}
	}, [seo]);
}

function PortfolioSite() {
	const { content, loading, error } = usePortfolio();

	useReveal([content]);
	usePageTracking();
	useSEO(content?.seo);

	if (loading) {
		return <PortfolioSkeleton />;
	}

	if (error || !content) {
		return (
			<div className="error-screen">
				<i
					className="fa-solid fa-triangle-exclamation"
					style={{ fontSize: 32, color: "#ff8080" }}
				/>
				<p>{error || "Something went wrong."}</p>
			</div>
		);
	}

	return (
		<div className="page-enter">
			<Navbar resumeUrl={content.hero.resumeUrl} />

			<Hero hero={content.hero} />

			<Suspense fallback={<SectionsSkeleton />}>
				<div className="section-enter">
					<About about={content.about} resumeUrl={content.hero.resumeUrl} />

					<Skills skills={content.skills} />

					<Timeline
						id="experience"
						eyebrowText="WORK EXPERIENCE"
						title="Professional Journey"
						items={content.experience}
						dotClass="exp-dot"
						badgeClass="exp"
						section="experience"
					/>

					<Timeline
						id="education"
						eyebrowText="EDUCATION"
						title="Academic Background"
						items={content.education}
						dotClass="edu-dot"
						badgeClass="edu"
						section="education"
					/>

					<Projects projects={content.projects} />

					<Certifications certifications={content.certifications} />

					<Resume resume={content.resume} />

					<Contact contact={content.contact} />

					<Footer />
				</div>
			</Suspense>

			<BackToTop />
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<PortfolioProvider>
					<CursorFX />

					<Routes>
						<Route path="/" element={<PortfolioSite />} />

						<Route
							path="/admin/login"
							element={
								<Suspense fallback={<AuthCardSkeleton />}>
									<AdminLoginPage />
								</Suspense>
							}
						/>

						<Route
							path="/admin/forgot-password"
							element={
								<Suspense fallback={<AuthCardSkeleton />}>
									<ForgotPasswordPage />
								</Suspense>
							}
						/>

						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<Suspense fallback={<AdminDashboardSkeleton />}>
										<AdminDashboard />
									</Suspense>
								</ProtectedRoute>
							}
						/>
					</Routes>
				</PortfolioProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}
