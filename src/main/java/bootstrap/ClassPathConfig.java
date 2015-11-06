package bootstrap;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration.EnableWebMvcConfiguration;
import org.springframework.boot.autoconfigure.web.WebMvcAutoConfiguration.WebMvcAutoConfigurationAdapter;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
@Import({RepositoryConfig.class, EnableWebMvcConfiguration.class})
@ComponentScan(basePackages = {"com.*"})
public class ClassPathConfig extends WebMvcAutoConfigurationAdapter {
	
	private static Log logger = LogFactory.getLog(ClassPathConfig.class);
	
	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
			"classpath:/app/"	
	};
	private static String[] RESOURCE_LOCATIONS;
	
	static {
		RESOURCE_LOCATIONS = new String[CLASSPATH_RESOURCE_LOCATIONS.length];
		System.arraycopy(CLASSPATH_RESOURCE_LOCATIONS, 0, RESOURCE_LOCATIONS,
				0, CLASSPATH_RESOURCE_LOCATIONS.length);
	}
	
	private static final String[] STATIC_INDEX_HTML_RESOURCES;
	static {
		STATIC_INDEX_HTML_RESOURCES = new String[RESOURCE_LOCATIONS.length];
		for (int i = 0; i < STATIC_INDEX_HTML_RESOURCES.length; i++) {
			STATIC_INDEX_HTML_RESOURCES[i] = RESOURCE_LOCATIONS[i] + "index.html";
		}
	}
	
	@Autowired
	private ResourceLoader resourceLoader;
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		super.addResourceHandlers(registry);
		registry.addResourceHandler("/**")
				.addResourceLocations(RESOURCE_LOCATIONS)
				.setCachePeriod(0);
	}
	
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		addStaticIndexHtmlViewControllers(registry);
	}

	private void addStaticIndexHtmlViewControllers(ViewControllerRegistry registry) {
		for (String resource : STATIC_INDEX_HTML_RESOURCES) {
			if (this.resourceLoader.getResource(resource).exists()) {
				try {
					logger.info("Adding welcome page: "
							+ this.resourceLoader.getResource(resource).getURL());
				}
				catch (IOException ex) {
					// Ignore
				}
				// Use forward: prefix so that no view resolution is done
				registry.addViewController("/").setViewName("forward:index.html");
				return;
			}
		}
	}

}
