package bootstrap;

import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = { "com.repository" })
@EnableTransactionManagement(proxyTargetClass = true)
@EntityScan(basePackages="com.domain")
public class RepositoryConfig {
}
